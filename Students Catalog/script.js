window.addEventListener("DOMContentLoaded", function () {

    var nameInput = document.getElementById("nameInput");
    var addStudentBtn = document.getElementById("addStudentBtn");
    var gradeInput = document.getElementById("gradeInput");
    var addGradeBtn = document.getElementById("addGradeBtn");
    var studentsTableBody = document.getElementById("studentsTableBody");
    var gradesTableBody = document.getElementById("gradesTableBody");
    var hideGradesBtn = document.getElementById("hideGradesBtn");
    var gradesWrapper = document.getElementById("gradesWrapper");
    var gradesHeading = document.getElementById("gradesHeading");
    var sortGradesDown = document.getElementById("sortGradesDown");
    var sortAverageDown = document.getElementById("sortAverageDown");
    var sortGradesUp = document.getElementById("sortGradesUp");
    var sortAverageUp = document.getElementById("sortAverageUp");

    studentsTableBody.addEventListener("click", studentNameInput);
    addStudentBtn.addEventListener("click", studentNameInput);
    nameInput.addEventListener("keyup", studentNameInput);
    addGradeBtn.addEventListener("click", studentGradeInput);
    gradeInput.addEventListener("keyup", studentGradeInput);
    hideGradesBtn.addEventListener("click", studentGradeInput);
    sortGradesDown.addEventListener("click", studentGradeInput);
    sortAverageDown.addEventListener("click", studentNameInput);
    sortGradesUp.addEventListener("click", studentGradeInput);
    sortAverageUp.addEventListener("click", studentNameInput);

    var studentsList;
    var newGrade;
    var selectedIndex;
    var oldIndex;
    var sortOrder;

    getDatabase()
        .then((data) => {
            if (!data) {
                studentsList = [];
                return;
            }
            studentsList = Object.entries(data);
            addGradePropFix();
            drawStudentsTable();
        })
        .catch((err) => console.log(err));

    function studentNameInput(e) {
        if (nameInput.value && (e.target.id == "addStudentBtn" || e.key == "Enter")) {
            addStudent()
                .then(() => getDatabase())
                .then((data) => {
                    studentsList = Object.entries(data);
                    addGradePropFix();
                    drawStudentsTable();
                    highlightRow();
                })
                .catch((err) => console.log(err));

        } else if (e.target.dataset.id == "showGrades") {
            selectStudent(e)
            showGrades();
            drawGradesTable();
            clearHighlight();
            highlightRow();
        } else if (e.currentTarget.dataset.id == "sortBtn") {
            setSortOrder(e)
            sortAverageGrade();
            drawStudentsTable();
            syncSelectedIndex()
            highlightRow();
        }
    }

    function studentGradeInput(e) {
        if (gradeInput.value && (e.target.id == "addGradeBtn" || e.key == "Enter")) {
            addGrade()
                .then(() => {
                    studentsList[selectedIndex][1].grades.push(newGrade);
                    drawGradesTable();
                    drawStudentsTable();
                    highlightRow();
                })
                .catch((err) => console.log(err));
        } else if (e.target.id == "hideGradesBtn") {
            deselectStudent()
            hideGrades();
            clearHighlight();
        } else if (e.currentTarget.dataset.id == "sortBtn") {
            setSortOrder(e);
            sortStudentGrades();
            drawGradesTable();
        }
    }

    function selectStudent(e) {
        oldIndex = selectedIndex;
        selectedIndex = Number(e.target.dataset.index);
        studentsList[selectedIndex][1].selected = true;
        if (selectedIndex != oldIndex && (oldIndex || oldIndex == 0)) {
            studentsList[oldIndex][1].selected = false;
        }
    }

    function deselectStudent() {
        studentsList[selectedIndex][1].selected = false;
        selectedIndex = null;
        oldIndex = null;
    }

    function setSortOrder(e) {
        if (e.currentTarget.id == "sortGradesDown" || e.currentTarget.id == "sortAverageDown") {
            sortOrder = "descending";
        } else if (e.currentTarget.id == "sortGradesUp" || e.currentTarget.id == "sortAverageUp") {
            sortOrder = "ascending";
        }
    }

    function sortAverageGrade() {
        if (sortOrder == "ascending") {
            studentsList.sort(function (a, b) {
                return averageGrade(a[1].grades) - averageGrade(b[1].grades);
            });
        } else if (sortOrder == "descending") {
            studentsList.sort(function (a, b) {
                return averageGrade(b[1].grades) - averageGrade(a[1].grades);
            });
        }
    }

    function sortStudentGrades() {
        var grades = studentsList[selectedIndex][1].grades;
        if (sortOrder == "ascending") {
            grades.sort((a, b) => a - b);
        } else if (sortOrder == "descending") {
            grades.sort((a, b) => b - a);
        }
    }

    function addStudent() {
        var newStudent = {
            name: nameInput.value,
            discipline: "",
            selected: false,
        }
        nameInput.value = "";
        return serverRequest('POST', `https://students-catalog.firebaseio.com/.json`, newStudent)
    }

    function drawStudentsTable() {
        studentsTableBody.innerHTML = "";
        for (var i = 0; i < studentsList.length; i++) {
            let name = studentsList[i][1].name;
            let average = averageGrade(studentsList[i][1].grades);
            studentsTableBody.innerHTML += `
                <tr>
                    <td class="spacer"></td>
                    <td>${name}</td>
                    <td>${average}</td>
                    <td><button data-index ="${i}" data-id ="showGrades">Show grades</button></td>
                    <td class="spacer"></td>
                </tr>
            `;
        }
    }

    function addGrade() {
        newGrade = Number(gradeInput.value);
        newGrade = Number(newGrade.toFixed(2));
        var grades = studentsList[selectedIndex][1].grades;
        var key = studentsList[selectedIndex][0];
        gradeInput.value = "";
        return serverRequest('PUT', `https://students-catalog.firebaseio.com/${key}/grades/${grades.length}.json`, newGrade)
    }

    function drawGradesTable() {
        var grades = studentsList[selectedIndex][1].grades;
        gradesTableBody.innerHTML = "";
        for (var i = 0; i < grades.length; i++) {
            gradesTableBody.innerHTML += `
            <tr>
            <td>${grades[i]}</td>
            </tr>
            `;
        }
    }

    function showGrades() {
        gradesWrapper.classList.remove("hide");
        gradesWrapper.classList.add("float");
        studentsWrapper.classList.add("float");
        gradesHeading.innerHTML = studentsList[selectedIndex][1].name;
        gradeInput.value = "";
    }

    function hideGrades() {
        gradesWrapper.classList.add("hide");
        studentsWrapper.classList.remove("float");
        gradeInput.value = "";
    }

    function syncSelectedIndex() {
        for (var i = 0; i < studentsList.length; i++) {
            if (studentsList[i][1].selected == true) {
                selectedIndex = i;
            }
        }
    }

    function highlightRow() {
        var rows = studentsTableBody.querySelectorAll("tr");
        for (var i = 0; i < rows.length; i++) {
            if (i == selectedIndex) {
                rows[i].classList.add("highlight");
            }
        }
    }

    function clearHighlight() {
        var rows = studentsTableBody.querySelectorAll(".highlight");
        for (var i = 0; i < rows.length; i++) {
            rows[i].classList.remove("highlight");
        }
    }

    function averageGrade(arr) {
        if (arr.length == 0) return arr;
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        var average = (sum / arr.length).toFixed(2);
        average = Number(average);
        return average;
    }

    function addGradePropFix() {
        for (let student of studentsList) {
            if (!student[1].grades) student[1].grades = [];
        }

    }

    function getDatabase() {
        return serverRequest('GET', 'https://students-catalog.firebaseio.com/.json');
    }

    function serverRequest(method, url, body) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    if (method === 'GET') {
                        resolve(xhr.response);
                    } else {
                        resolve('Success');
                    }
                } else {
                    reject(`Server error: ${xhr.status}`);
                }
            });
            xhr.addEventListener('error', () => {
                reject(`Network error`);
            });
            xhr.open(method, url);
            xhr.responseType = 'json';
            if (body !== undefined) {
                xhr.send(JSON.stringify(body));
            } else {
                xhr.send();
            }
        });
    }
});