const btnSave = document.querySelector(".btn-save");
const btnReset = document.querySelector(".btn-reset");

const txtName = document.querySelector("#name");
const txtClass = document.querySelector("#class");



btnReset.addEventListener("click", (e) => {
    e.preventDefault();
    let errors = document.querySelectorAll("small");
    errors.forEach(ele => {
        ele.classList.remove("error");
    })
    txtName.value = "";
    txtClass.value = "";
})

const studentsAPI = "https://62affd42b0a980a2ef47ae7c.mockapi.io/students";
const getStudents = () => {
    axios
        .get(studentsAPI)
        .then(res => {
            renderStudents(res.data);
        })
}

const renderStudents = (students) => {
    const tbody = document.querySelector("tbody");
    let htmls = students.map((student, index) => {
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${student.studentID}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td><button class="btn btn-edit" onclick="handleUpdate(${student.studentID})">Sửa</button></td>
            <td><button class="btn btn-delete" onclick="handleDelete(${student.studentID})">Xóa</button></td>
          </tr>
        `
    })
    tbody.innerHTML = htmls.join("");
}

const handleClickSave = () => {
    btnSave.addEventListener("click", (e) => {
        e.preventDefault();
        let checkInput = 0;
        if (!isEmpty(txtName.value)) {
            txtName.parentNode.querySelector("small").innerText = "Không bỏ trống..."
            txtName.parentNode.querySelector("small").classList.add("error");
        }
        else {
            txtName.parentNode.querySelector("small").classList.remove("error");
            checkInput += 1;
        }

        if (!isEmpty(txtClass.value)) {
            txtClass.parentNode.querySelector("small").innerText = "Không bỏ trống..."
            txtClass.parentNode.querySelector("small").classList.add("error");
        }
        else {
            txtClass.parentNode.querySelector("small").classList.remove("error");
            checkInput += 1;
        }

        if (checkInput >= 2) {
            let dataStudent = {
                name: txtName.value,
                class: txtClass.value,
            }
            axios
                .post("https://62affd42b0a980a2ef47ae7c.mockapi.io/students", dataStudent)
                .then(() => {
                    getStudents();
                    txtName.value = "";
                    txtClass.value = "";
                });
        }
    })
}

getStudents();
handleClickSave();

const handleDelete = (id) => {
    axios
        .delete(`https://62affd42b0a980a2ef47ae7c.mockapi.io/students/${id}`)
        .then((res) => getStudents());
}

const handleUpdate = (id) => {
    axios
        .get(`https://62affd42b0a980a2ef47ae7c.mockapi.io/students/${id}`)
        .then((res) => {
            txtName.value = res.data.name;
            txtClass.value = res.data.class;
            let dataStudent = {
                name: txtName.value,
                class: txtClass.value
            }
            axios
                .put(`https://62affd42b0a980a2ef47ae7c.mockapi.io/students/${id}`, dataStudent)
                .then(() => {
                    getStudents();
                });
        });
}

const isEmpty = (value) => {
    if (value) return true;
    return false;
}

