import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import Jjres from "./jjres";

const classes = [];

document.getElementById("form").addEventListener("click", async () => {
    const jjrss = new Jjres("연희중", "cxoa", "0", "0", "0", "홍길동", "");
    await jjrss.test();
});

document.getElementById("add").addEventListener("click", () => {
    const className = prompt("과목명을 입력해 주세요.");

    const classElement = document.createElement("li");
    classElement.className = "list-group-item d-flex justify-content-between align-items-center";
    classElement.innerText = className;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "badge btn btn-danger btn-sm";
    deleteButton.innerText = "삭제";
    deleteButton.addEventListener("click", () => {
        const index = classes.indexOf(className);
        classes.splice(index, 1);
        classElement.remove();
    });

    classElement.appendChild(deleteButton);

    document.getElementById("classList").appendChild(classElement);

    classes.push(className);
});
