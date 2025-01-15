
# University ERP System - MongoDB Schema

This document describes the MongoDB schema for a University ERP system, outlining the various collections and their relationships.

## Schema Overview

The system consists of several collections, each representing different entities in the university system such as students, teachers, departments, programs, and more. The relationships between these collections help organize and link the data effectively.

### Collections Overview

- **School**: Represents different schools within the university.
- **Department**: Belongs to a School, and represents the departments under each school.
- **Programme**: Offered by a Department, represents the various academic programs.
- **Specialization**: A field of study under a Programme.
- **Teacher**: Associated with a Department and can teach multiple Subjects.
- **Subject**: Offered within a Programme and optionally a Specialization, taught by multiple Teachers, and contains multiple Questions.
- **Student**: Enrolled in a Programme and optionally a Specialization, can enroll in multiple Subjects.
- **Examination**: Pertains to a Subject and includes multiple Questions.
- **Question**: Belongs to a Subject and optionally an Examination.
- **Result**: Links a Student to an Examination and Subject, recording the marks obtained.
- **StudentSubject**: Junction collection to handle the many-to-many relationship between Students and Subjects.

## Collection Details

### 1. School Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `name`: String (Unique, Required)
  - `description`: String
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**: 
  - One-to-Many: One School has many Departments.

### 2. Department Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `name`: String (Unique, Required)
  - `school`: ObjectId (Reference to School, Required)
  - `description`: String
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Departments belong to one School.
  - One-to-Many: One Department offers many Programmes.

### 3. Programme Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `name`: String (Unique, Required)
  - `department`: ObjectId (Reference to Department, Required)
  - `degreeType`: String (Enum: 'Bachelor', 'Master', 'PhD', etc., Required)
  - `duration`: Number (Required)
  - `description`: String
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Programmes belong to one Department.
  - One-to-Many: One Programme can have multiple Specializations.
  - One-to-Many: One Programme can offer multiple Subjects.

### 4. Specialization Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `name`: String (Unique, Required)
  - `programme`: ObjectId (Reference to Programme, Required)
  - `description`: String
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Specializations belong to one Programme.

### 5. Teacher Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `firstName`: String (Required)
  - `lastName`: String (Required)
  - `department`: ObjectId (Reference to Department, Required)
  - `email`: String (Unique, Required)
  - `phoneNumber`: String
  - `hireDate`: Date (Required)
  - `position`: String
  - `photo`: String (URL or Path)
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Teachers belong to one Department.
  - Many-to-Many: Teachers can teach multiple Subjects and Subjects can be taught by multiple Teachers.

### 6. Subject Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `subjectCode`: String (Unique, Required)
  - `subjectName`: String (Required)
  - `department`: ObjectId (Reference to Department, Required)
  - `programme`: ObjectId (Reference to Programme, Required)
  - `specialization`: ObjectId (Reference to Specialization, optional)
  - `description`: String
  - `reported`: String
  - `credits`: Number (Required)
  - `semester`: Number (Required)
  - `teachers`: Array of ObjectIds (References to Teacher)
  - `questions`: Array of ObjectIds (References to Question)
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Subjects belong to one Department.
  - Many-to-One: Many Subjects belong to one Programme.
  - Many-to-One: Many Subjects belong to one Specialization (optional).
  - Many-to-Many: Subjects can be taught by multiple Teachers.
  - One-to-Many: One Subject can have multiple Examinations.

### 7. Student Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `firstName`: String (Required)
  - `lastName`: String (Required)
  - `programme`: ObjectId (Reference to Programme, Required)
  - `specialization`: ObjectId (Reference to Specialization)
  - `dateOfBirth`: Date (Required)
  - `gender`: String (Enum: 'Male', 'Female', 'Other', Required)
  - `nationality`: String
  - `email`: String (Unique, Required)
  - `phoneNumber`: String
  - `address`: String
  - `photo`: String (URL or Path)
  - `enrollmentDate`: Date (Required)
  - `status`: String (Enum: 'Active', 'Inactive', 'Graduated', 'On Leave', Default: 'Active')
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Students belong to one Programme.
  - Many-to-One: Many Students belong to one Specialization (optional).
  - Many-to-Many: Students can enroll in multiple Subjects via the **StudentSubject** collection.

### 8. Examination Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `subject`: ObjectId (Reference to Subject, Required)
  - `examinationType`: String (Enum: 'Midterm', 'Final', 'Quiz', 'Assignment', Required)
  - `examinationDate`: Date (Required)
  - `totalMarks`: Number (Required)
  - `questions`: Array of ObjectIds (References to Question)
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Examinations belong to one Subject.
  - One-to-Many: One Examination can have multiple Questions.

### 9. Question Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `subject`: ObjectId (Reference to Subject, Required)
  - `questionText`: String (Required)
  - `questionType`: String (Enum: 'MCQ', 'True/False', 'Short Answer', 'Essay', Required)
  - `marks`: Number (Required)
  - `examination`: ObjectId (Reference to Examination)
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Questions belong to one Subject.
  - Many-to-One: Many Questions belong to one Examination (optional).

### 10. Result Collection
- **Fields**:
  - `_id`: ObjectId (Primary Key)
  - `student`: ObjectId (Reference to Student, Required)
  - `examination`: ObjectId (Reference to Examination, Required)
  - `subject`: ObjectId (Reference to Subject, Required)
  - `marksObtained`: Number (Required)
  - `grade`: String
  - `remarks`: String
  - `createdAt`: Date
  - `updatedAt`: Array of Objects containing date and userId
- **Relationships**:
  - Many-to-One: Many Results belong to one Student.
  - Many-to-One: Many Results belong to one Examination.
  - Many-to-One: Many Results belong to one Subject.


+-----------------+           +-------------------+           +-----------------+
|     School      |           |    Department     |           |    Programme    |
+-----------------+           +-------------------+           +-----------------+
| _id             |<--------1 | _id               |1-------->*| _id             |
| name            |           | name              |           | name            |
| description     |           | school (ref)      |           | department (ref)|
| createdAt       |           | description       |           | degreeType      |
| updatedAt       |           | createdAt         |           | duration        |
+-----------------+           | updatedAt         |           | description     |
                              +-------------------+           | createdAt       |
                                                              | updatedAt       |
                                                              +-----------------+

                             +---------------------+
                             |   Specialization    |
                             +---------------------+
                             | _id                 |
                             | name                |
                             | programme (ref)     |
                             | description         |
                             | createdAt           |
                             | updatedAt           |
                             +---------------------+

+-----------------+           +-------------------+           +-----------------+
|     Teacher     |           |      Subject      |           |     Student     |
+-----------------+           +-------------------+           +-----------------+
| _id             |           | _id               |           | _id             |
| firstName       |1-------->*| subjectCode       |1-------->*|  Name           |
| lastName        |           | subjectName       |           | status          |
| department (ref)|           | department (ref)  |           | programme (ref) |
| email           |           | programme (ref)   |           | specialization(ref)|
| phoneNumber     |           | specialization(ref)|          | dateOfBirth     |
| hireDate        |           | description       |           | gender          |
| position        |           | credits           |           | nationality     |
| photo           |           | semester          |           | email           |
| createdAt       |           | teachers [ref]    |           | phoneNumber     |
| updatedAt       |           | questions [ref]   |           | address         |
+-----------------+           | createdAt         |           | photo           |
                              | updatedAt         |           | enrollmentDate  |
                              +-------------------+           |  createdAt      |
                                                              | updatedAt       |
                                                              |                 |
                                                               +-----------------+

+-----------------+           +-------------------+           +-----------------+
|   Examination   |1-------->*|     Question      |           |      Result     |
+-----------------+           +-------------------+           +-----------------+
| _id             |           | _id               |           | _id             |
| subject (ref)   |           | subject (ref)     |           | student (ref)   |
| examinationType |           | questionText      |           | examination (ref)|
| examinationDate |           | questionType      |           | subject (ref)   |
| totalMarks      |           | marks             |           | marksObtained   |
| questions [ref] |           | examination (ref) |           | grade           |
| createdAt       |           | createdAt         |           | remarks         |
| updatedAt       |           | updatedAt         |           | createdAt       |
+-----------------+           +-------------------+           | updatedAt       |
                                                          +-----------------+

+-------------------------+
|     StudentSubject      |
+-------------------------+
| _id                     |
| student (ref)           |
| subject (ref)           |
| enrollmentDate          |
| status                  |
| createdAt               |
| updatedAt               |
+-------------------------+
