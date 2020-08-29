# High School Board

The app shows classes and students of a highschool.

Classes are 4 classes one for each year of study (9 - 12). Each student will belong to a class.

Overview page -> All classes can be seen.
Class page -> All students can be seen. A teacher can add or remove students.

Student page -> All grades of that particular student can be seen. A teacher can grade students on:

- math
- biology
- sports
- history

Everyone can create an account.
Teacher privileges are given directly in MongoDB by setting - teacher: true

Everyone can see classes, students and grades.
Only teachers can add, remove and grade students.

## To run the app on your local machine you must first:

### Note: If you use the same database credentials and secret, login inside the app with `test@test.com` and `password` This account has teacher role set to `true` so you can add, delete students and add grades.

- Clone or download the github repo
- In a split terminal, on one side `cd` into `high-school-board/frontend` and run `npm install`
- After installation run `npm start` to start the frontend side of app
- On the other side of the split terminal `cd` into `high-school-board/backend` and run `npm install` to install dependencies
- create a `.env` file inside `high-school-board/backend` and add 2 variables to it, first one: `MONGO_URI=mongoDB-connection-string-here` and second one: `JWT_SECRET=secret-string-here`
- Run `npm start` to start the backend server
- Any user with the teacher role has to be assigned directly inside the database by setting `teacher` prop to `true`, any new account is simply a guest.
