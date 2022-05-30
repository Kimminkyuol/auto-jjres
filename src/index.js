import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import Jjres from "./jjres";
import Swal from "sweetalert2";

const classes = [];

document.getElementById("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const school = document.getElementById("school").value;
    const room = document.getElementById("room").value;
    const hak = document.getElementById("hak").value;
    const ban = document.getElementById("ban").value;
    const bun = document.getElementById("bun").value;
    const name = document.getElementById("name").value;

    const jjres = new Jjres(school, room, hak, ban, bun, name, classes);

    try {
        await jjres.test();
    } catch (error) {
        await Swal.fire({
            icon: "error",
            title: "오류",
            html: "오류가 발생했습니다.<br>" + error
        });

        return;
    }

    Swal.fire({
        icon: "success",
        title: "테스트 성공",
        showDenyButton: true,
        confirmButtonText: "바로 신청",
        denyButtonColor: "#3085d6",
        denyButtonText: "신청 예약",
    }).then(async result => {
        if (result.isConfirmed) {
            jjres.setApply().then(result => {
                Swal.fire({
                    icon: "info",
                    title: "신청 완료",
                    html: "신청이 완료되었습니다.<br>" + result
                });
            });
        } else if (result.isDenied) {
            Swal.fire({
                title: "신청 예약",
                confirmButtonText: "확인",
                html: "<input id='date' type='datetime-local' class='form-control'>",
                preConfirm: () => {
                    return document.getElementById("date").value;
                },
                didOpen(popup) {
                    const date = popup.querySelector("#date");

                    date.value = new Date(new Date().setMilliseconds(0) + 32400000).toISOString().slice(0, -1);
                    date.min = date.value;
                }
            }).then(result => {
                const date = new Date(result.value);
                let time = date.getTime() - new Date().getTime();

                setTimeout(() => {
                    jjres.setApply().then(result => {
                        Swal.fire({
                            icon: "info",
                            title: "신청 완료",
                            html: "신청이 완료되었습니다.<br>" + result
                        });
                    });
                }, time);

                Swal.fire({
                    icon: "success",
                    title: "신청 예약",
                    html: "신청 예약이 완료되었습니다.<br>이 창을 닫지 마세요.",
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    didOpen(popup) {
                        const div = popup.querySelector("div");
                        time = Math.floor(time / 1000);
                        setInterval(() => {
                            div.innerText = String(time) + "초 남음";
                            time -= 1;
                        }, 1000);
                    }
                });
            });
        }
    });
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
