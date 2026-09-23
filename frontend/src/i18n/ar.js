const ar = {
    translation: {
        appName: 'الجدول المدرسي',

        dashboard: 'لوحة التحكم',
        classes: 'الفصول',
        teachers: 'المعلمون',
        subjects: 'المواد',
        assignments: 'التكليفات',
        timeSlots: 'الفترات الزمنية',
        timetable: 'الجدول الدراسي',
        logout: 'تسجيل الخروج',

        login: 'تسجيل الدخول',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        signIn: 'دخول',
        signingIn: 'جاري تسجيل الدخول...',
        welcomeBack: 'مرحبًا بعودتك',

        loading: 'جاري التحميل...',
        view_details: 'عرض التفاصيل',
        timetable_generation: 'إنشاء الجدول الدراسي',
        timetable_generation_description: 'إنشاء الجدول الدراسي تلقائيًا بناءً على بيانات المدرسة والقيود المحددة.',
        generate_timetable: 'إنشاء الجدول الدراسي',


        add: 'إضافة',
        edit: 'تعديل',
        delete: 'حذف',
        update: 'تحديث',
        cancel: 'إلغاء',
        save: 'حفظ',
        actions: 'الإجراءات',

        name: 'الاسم',
        room: 'الغرفة',
        teacher: 'المعلم',
        subject: 'المادة',
        schoolClass: 'الفصل',
        weeklyLessons: 'الحصص الأسبوعية',

        day: 'اليوم',
        startTime: 'وقت البداية',
        endTime: 'وقت النهاية',

        addClass: 'إضافة فصل جديد',
        editClass: 'تعديل الفصل',
        classesList: 'قائمة الفصول',

        addTeacher: 'إضافة معلم جديد',
        editTeacher: 'تعديل المعلم',
        teachersList: 'قائمة المعلمين',

        addSubject: 'إضافة مادة جديدة',
        editSubject: 'تعديل المادة',
        subjectsList: 'قائمة المواد',

        addAssignment: 'إضافة تكليف جديد',
        editAssignment: 'تعديل التكليف',
        assignmentsList: 'قائمة التكليفات',

        addTimeSlot: 'إضافة فترة زمنية جديدة',
        editTimeSlot: 'تعديل الفترة الزمنية',
        timeSlotsList: 'قائمة الفترات الزمنية',

        selectTeacher: 'اختر المعلم',
        selectSubject: 'اختر المادة',
        selectClass: 'اختر الفصل',
        selectDay: 'اختر اليوم',

        allClasses: 'جميع الفصول',
        filterByClass: 'تصفية حسب الفصل',

        generateTimetable: 'إنشاء الجدول',
        generating: 'جاري إنشاء الجدول...',
        regenerateTimetable: 'إعادة إنشاء الجدول',

        exportPdf: 'تصدير PDF',

        free: 'فارغ',

        saturday: 'السبت',
        sunday: 'الأحد',
        monday: 'الإثنين',
        tuesday: 'الثلاثاء',
        wednesday: 'الأربعاء',

        loading: 'جاري التحميل...',
        saving: 'جاري الحفظ...',

        noClasses: 'لا توجد فصول.',
        noTeachers: 'لا يوجد معلمون.',
        noSubjects: 'لا توجد مواد.',
        noAssignments: 'لا توجد تكليفات.',
        noTimeSlots: 'لا توجد فترات زمنية.',
        noTimetable: 'لا يوجد جدول دراسي.',

        classCreated: 'تم إنشاء الفصل بنجاح.',
        classUpdated: 'تم تحديث الفصل بنجاح.',
        classDeleted: 'تم حذف الفصل بنجاح.',

        teacherCreated: 'تم إنشاء المعلم بنجاح.',
        teacherUpdated: 'تم تحديث المعلم بنجاح.',
        teacherDeleted: 'تم حذف المعلم بنجاح.',

        subjectCreated: 'تم إنشاء المادة بنجاح.',
        subjectUpdated: 'تم تحديث المادة بنجاح.',
        subjectDeleted: 'تم حذف المادة بنجاح.',

        assignmentCreated: 'تم إنشاء التكليف بنجاح.',
        assignmentUpdated: 'تم تحديث التكليف بنجاح.',
        assignmentDeleted: 'تم حذف التكليف بنجاح.',

        timeSlotCreated: 'تم إنشاء الفترة الزمنية بنجاح.',
        timeSlotUpdated: 'تم تحديث الفترة الزمنية بنجاح.',
        timeSlotDeleted: 'تم حذف الفترة الزمنية بنجاح.',

        timetableGenerated: 'تم إنشاء الجدول الدراسي بنجاح.',

        failedToLoad: 'فشل تحميل البيانات.',
        failedToSave: 'فشل حفظ البيانات.',
        failedToDelete: 'فشل حذف البيانات.',
        failedToGenerate: 'فشل إنشاء الجدول الدراسي.',

        deleteConfirmation:
            'هل أنت متأكد من حذف هذا العنصر؟',

        endTimeMustBeLater:
            'يجب أن يكون وقت النهاية بعد وقت البداية.',

        maxTeacherLessonsPerDay:
            'الحد الأقصى لحصص المعلم في اليوم',

        noConsecutiveLessons:
            'عدم وضع حصص متتالية لنفس التكليف',

        teacherConflict:
            'لا يمكن للمعلم تدريس فصلين في نفس الوقت.',

        classConflict:
            'لا يمكن للفصل أن يحتوي على حصتين في نفس الوقت.',

        weeklyLessonsConstraint:
            'يجب أن يحصل كل تكليف على عدد الحصص الأسبوعية المحدد.',

        validationSuccessful:
            'تم التحقق من صحة الجدول بنجاح.',

        noValidTimetable:
            'تعذر إنشاء جدول دراسي صالح.',

        language: 'اللغة',
        english: 'الإنجليزية',
        arabic: 'العربية',
    },
};

export default ar;
