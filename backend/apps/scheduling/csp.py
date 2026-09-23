from collections import defaultdict

from constraint import (
    Problem,
    AllDifferentConstraint,
)

from django.db import transaction

from apps.school.models import (
    TeachingAssignment,
)

from .models import (
    TimeSlot,
    TimeTableSlot,
)


MAX_TEACHER_LESSONS_PER_DAY = 4


def create_assignment_daily_constraint(
    time_slot_map
):

    def constraint(*values):

        days = []

        for time_slot_id in values:

            day = time_slot_map[
                time_slot_id
            ]

            days.append(day)

        return (
            len(days)
            ==
            len(set(days))
        )

    return constraint


def create_daily_limit_constraint(
    time_slot_map,
    max_lessons
):

    def constraint(*values):

        day_counts = defaultdict(int)

        for time_slot_id in values:

            day = time_slot_map[
                time_slot_id
            ]

            day_counts[day] += 1

            if (
                day_counts[day]
                > max_lessons
            ):

                return False

        return True

    return constraint


def generate_timetable(school):

    problem = Problem()

    assignments = (
        TeachingAssignment.objects
        .filter(
            school_class__school=school
        )
        .select_related(
            'teacher',
            'subject',
            'school_class',
        )
    )

    time_slots = (
        TimeSlot.objects
        .filter(
            school=school
        )
    )

    time_slot_ids = list(
        time_slots.values_list(
            'id',
            flat=True
        )
    )

    time_slot_map = {

        slot.id: slot.day

        for slot in time_slots

    }

    assignment_variables = {}

    teacher_variables = {}

    class_variables = {}

    for assignment in assignments:

        variables = []

        for lesson_number in range(
            1,
            assignment.weekly_lessons + 1
        ):

            variable_name = (
                f"assignment_{assignment.id}_"
                f"lesson_{lesson_number}"
            )

            problem.addVariable(
                variable_name,
                time_slot_ids
            )

            variables.append(
                variable_name
            )

            teacher_id = (
                assignment.teacher_id
            )

            teacher_variables.setdefault(
                teacher_id,
                []
            ).append(
                variable_name
            )

            class_id = (
                assignment.school_class_id
            )

            class_variables.setdefault(
                class_id,
                []
            ).append(
                variable_name
            )

        assignment_variables[
            assignment.id
        ] = variables

    # -----------------------------
    # Assignment constraints
    # -----------------------------

    for variables in (
        assignment_variables.values()
    ):

        problem.addConstraint(
            AllDifferentConstraint(),
            variables
        )

        problem.addConstraint(
            create_assignment_daily_constraint(
                time_slot_map
            ),
            variables
        )

    # -----------------------------
    # Teacher constraints
    # -----------------------------

    for variables in (
        teacher_variables.values()
    ):

        problem.addConstraint(
            AllDifferentConstraint(),
            variables
        )

        problem.addConstraint(
            create_daily_limit_constraint(
                time_slot_map,
                MAX_TEACHER_LESSONS_PER_DAY
            ),
            variables
        )

    # -----------------------------
    # Class constraints
    # -----------------------------

    for variables in (
        class_variables.values()
    ):

        problem.addConstraint(
            AllDifferentConstraint(),
            variables
        )

    # -----------------------------
    # Solve
    # -----------------------------

    solution = problem.getSolution()

    if solution is None:

        return None

    # -----------------------------
    # Save
    # -----------------------------

    with transaction.atomic():

        TimeTableSlot.objects.filter(
            time_slot__school=school
        ).delete()

        for variable_name, time_slot_id in (
            solution.items()
        ):

            parts = variable_name.split('_')

            assignment_id = int(
                parts[1]
            )

            TimeTableSlot.objects.create(
                assignment_id=assignment_id,
                time_slot_id=time_slot_id,
            )

    return solution


def validate_timetable(school):

    timetable = (
        TimeTableSlot.objects
        .filter(
            time_slot__school=school
        )
        .select_related(
            'assignment__teacher',
            'assignment__school_class',
            'time_slot',
        )
    )

    # -----------------------------
    # Teacher conflict
    # -----------------------------

    teacher_slots = set()

    for item in timetable:

        key = (
            item.assignment.teacher_id,
            item.time_slot_id,
        )

        if key in teacher_slots:

            return False, (
                'Teacher conflict: '
                f'{item.assignment.teacher.name}'
            )

        teacher_slots.add(key)

    # -----------------------------
    # Class conflict
    # -----------------------------

    class_slots = set()

    for item in timetable:

        key = (
            item.assignment.school_class_id,
            item.time_slot_id,
        )

        if key in class_slots:

            return False, (
                'Class conflict: '
                f'{item.assignment.school_class.name}'
            )

        class_slots.add(key)

    # -----------------------------
    # Assignment conflict
    # -----------------------------

    assignment_slots = set()

    for item in timetable:

        key = (
            item.assignment_id,
            item.time_slot_id,
        )

        if key in assignment_slots:

            return False, (
                'Assignment conflict: '
                f'{item.assignment_id}'
            )

        assignment_slots.add(key)

    # -----------------------------
    # Assignment days
    # -----------------------------

    assignment_days = defaultdict(set)

    for item in timetable:

        assignment_id = (
            item.assignment_id
        )

        day = item.time_slot.day

        if day in assignment_days[
            assignment_id
        ]:

            return False, (
                'Assignment has two lessons '
                f'on the same day: '
                f'{assignment_id}'
            )

        assignment_days[
            assignment_id
        ].add(day)

    # -----------------------------
    # Teacher daily limit
    # -----------------------------

    teacher_daily_counts = defaultdict(int)

    for item in timetable:

        teacher_id = (
            item.assignment.teacher_id
        )

        day = item.time_slot.day

        key = (
            teacher_id,
            day,
        )

        teacher_daily_counts[key] += 1

        if (
            teacher_daily_counts[key]
            > MAX_TEACHER_LESSONS_PER_DAY
        ):

            return False, (
                'Teacher daily limit exceeded: '
                f'{item.assignment.teacher.name} '
                f'on {day}'
            )

    return True, 'Timetable is valid.'
