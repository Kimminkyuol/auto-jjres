export default class Jjres {
    constructor(school, room, hak, ban, bun, classes) {
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
        this.ban = ban;
        this.bun = bun;
        this.classes = classes;
    }

    async main() {
        await this.codeCheck();
        await this.roomCheck();
        await this.getData();
        await this.getName();
        return await this.setApply();
    }

    async test() {
        try {
            await this.codeCheck();
        } catch (error) {
            throw "학교 이름 오류";
        }

        try {
            await this.roomCheck();
        } catch (error) {
            throw "방 이름 오류";
        }

        try {
            await this.getData();
        } catch (error) {
            console.log(error);
            throw "내부 오류";
        }

        try {
            await this.getName();
        } catch (error) {
            throw "과목명 오류";
        }
    }

    async codeCheck() {
        const data = {
            "key": this.school,
            "caseBy": "shcool_list"
        };

        const r = await fetch("/req", {
            method: "POST",
            body: JSON.stringify({
                method: "POST",
                url: 0,
                data: data
            })
        });

        const element = new DOMParser().parseFromString(await r.text(), "text/html");
        this.schoolCode = element.querySelector(`[java\\.val*="${this.school}"]`).value;
    }

    async roomCheck() {
        const data = {
            "caseBy": "roomchk",
            "schoolname": this.school,
            "schoolcode": this.schoolCode,
            "roomnumber": this.room,
        };

        const r = await fetch("/req", {
            method: "POST",
            body: JSON.stringify({
                method: "POST",
                url: 0,
                data: data
            })
        });

        const text = (await r.text()).split("_");

        this.tchCode = text[1];
        this.schDiv = text[2];
    }

    async getData() {
        const data = {
            "roomnumber": this.room,
            "schoolname": "",
            "tagetType": "school",
            "tchcode": this.tchCode,
            "schoolcode": this.schoolCode,
            "sch_div": this.schDiv,
        };

        const r = await fetch("/req", {
            method: "POST",
            body: JSON.stringify({
                method: "GET",
                url: 2,
                data: data
            })
        });

        const element = new DOMParser().parseFromString(await r.text(), "text/html");

        for (const className in this.classes) {
            const check = element.querySelector(`input[valid\\.lectnm*=${this.classes[className]}]`).value;
            this.classes[className] = check + "|" + this.classes[className];
        }

        this.etcIdx = element.querySelector("#etcidx").value;
        this.etcType = element.querySelector("#etcType").value;
        this.etcApplyCount = element.querySelector("#etc_applyCount").value;
        this.diffDate = element.querySelector("#diff_date").value;
        this.userListTypeYn = element.querySelector("#userListtypeYn").value;
    }

    async getName() {
        const data = {
            "caseBy": "change_bun",
            "schoolcode": this.schoolCode,
            "schoolname": this.school,
            "tchcode": this.tchCode,
            "sch_div": this.schDiv,
            "chang_hak": this.hak,
            "chang_ban": this.ban,
            "chang_bun": this.bun,
            "gyeoloneName": "",
            "etcidx": this.etcIdx,
        };

        const r = await fetch("/req", {
            method: "POST",
            body: JSON.stringify({
                method: "POST",
                url: 0,
                data: data
            })
        });

        this.stdName = await r.text();
    }

    async setApply() {
        const data = {
            "caseBy": "setApply",
            "roomnumber": this.room,
            "schoolcode": this.schoolCode,
            "schoolname": "",
            "tchcode": this.tchCode,
            "sch_div": this.schDiv,
            "lCodeClass": this.classes.join(","),
            "etcType": this.etcType,
            "etc_applyCount": this.etcApplyCount,
            "etcidx": this.etcIdx,
            "diff_date": this.diffDate,
            "userListtypeYn": this.userListTypeYn,
            "gyeoloneName": "",
            "std_hak": this.hak,
            "std_ban": this.ban,
            "std_bun": this.bun,
            "std_name": this.stdName,
            "mode": "true",
        };

        return (await fetch("/req", {
            method: "POST",
            body: JSON.stringify({
                method: "POST",
                url: 1,
                data: data
            })
        })).text();
    }
}
