import { course } from './src/services/course.js';
console.log("course:", course);
try {
  await course.getAllCourses();
} catch (e) {
  console.log("Error:", e);
}
