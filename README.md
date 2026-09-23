# School Timetable Generator

This project is a full-stack school timetable generator built with **Django REST Framework** and **React**.

It uses a **Constraint Satisfaction Problem (CSP)** approach to automatically generate valid school timetables while respecting teacher, class, lesson, and time-slot constraints.

## Table of Contents

* [Features](#features)
* [Technologies](#technologies)
* [Project Structure](#project-structure)
* [Backend Setup](#backend-setup)
* [Frontend Setup](#frontend-setup)
* [Usage](#usage)
* [Timetable Generation](#timetable-generation)

## Features

* User authentication
* Multi-school data isolation
* Automatic timetable generation
* CSP-based scheduling
* Timetable validation
* Dashboard
* Arabic and English support
* RTL support
* PDF timetable export

## Technologies

### Backend

* Python
* Django
* Django REST Framework
* Python Constraint
* SQLite
* django-cors-headers

### Frontend

* React
* Vite
* Axios
* Tailwind CSS
* React Router
* React Icons
* i18next
* jsPDF
* jsPDF AutoTable

## Project Structure

```text
school-timetable-generator/
│
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── school/
│   │   └── scheduling/
│   │
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── i18n/
    │   └── pages/
    │
    └── package.json
```

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

On Linux/macOS:

```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Apply migrations:

```bash
python manage.py migrate
```

Create a superuser if needed:

```bash
python manage.py createsuperuser
```

Run the development server:

```bash
python manage.py runserver
```

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173/
```

Make sure the Django backend is running at the same time.

## Usage

After starting the backend and frontend:

1. Register a user and create a school.
2. Log in to the application.
3. Add the required school data.
4. Configure the available time slots.
5. Generate the timetable.
6. Review and validate the generated timetable.
7. Export the timetable as a PDF.

## Timetable Generation

The timetable generation feature is implemented using a **Constraint Satisfaction Problem (CSP)** approach.

The scheduler creates variables for the required lessons and assigns available time slots while respecting the defined constraints.

The main constraints include:

* A teacher cannot teach two classes at the same time.
* A class cannot have two lessons at the same time.
* Lessons belonging to the same assignment are scheduled in different time slots.
* Assignment lessons are distributed across different days.
* Teachers have a maximum number of lessons per day.
* The generated timetable is validated before being stored.

License

This project is developed for educational and development purposes.
