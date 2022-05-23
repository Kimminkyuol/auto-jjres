const URL1 = "http://u.jjrss.com/user_001_json.php";
const URL2 = "http://u.jjrss.com/user_201J.php";
const URL3 = "http://u.jjrss.com/user_201V.php";

export default class Jjres {
    constructor(school, room, hak, bun, ban, name, classes) {
        this.stdName = null;
        this.diffDate = null;
        this.userListTypeYn = null;
        this.etcApplyCount = null;
        this.etcType = null;
        this.etcIdx = null;
        this.schDiv = null;
        this.tchCode = null;
        this.schoolCode = null;
        this.school = school;
        this.room = room;
        this.hak = hak;
        this.bun = bun;
        this.ban = ban;
        this.name = name;
        this.classes = classes;
    }

    main() {

    }

    codeCheck() {
        const data = {
            "key": encodeURIComponent(this.school),
            "caseBy": "school_list"
        };

        console.log(data);

        fetch("/post", {
            method: "POST",
            body: JSON.stringify({
                url: URL1,
                data: data
            })
        })
            .then(r => r.text())
            .then(console.log);
    }
}
