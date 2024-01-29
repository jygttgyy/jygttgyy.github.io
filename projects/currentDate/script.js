function num0(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}
function e() {
    var d = new Date()
    document.getElementById("date").innerText = num0(d.getHours()) + ":" + num0(d.getMinutes()) + ":" + num0(d.getSeconds()) + "\n" + d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear();
    setTimeout(e, 100);
}
e();