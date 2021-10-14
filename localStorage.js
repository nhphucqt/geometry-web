var curTheme = "darksky";
if (typeof(Storage) !== "undefined") {
    if (localStorage.getItem("theme") === null) 
        localStorage.setItem("theme", curTheme);
    curTheme = localStorage.getItem("theme");
}
else {
    console.log("Storage not supported");
}