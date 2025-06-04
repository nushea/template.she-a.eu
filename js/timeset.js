var currentDate = new Date();

// load the wasm module
var script = document.createElement('script');
script.src = 'https://template.she-a.eu/js/time.js';
document.head.appendChild(script);
var curtime;

var divt = document.getElementById('HaYiTime');
divt.innerHTML = "HaYi Time";

var loct = document.getElementById('LocalTime');
loct.innerHTML = "Local Time";

// Time handling

onWASMLoad(CyraTime, (CyraTime) => {
    if (CyraTime) {
        const curtime = CyraTime.cwrap("curtime", null, ["number"]);
        const updateTime = () => {

                        currentDate = new Date();
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth() + 1;
                        const day = currentDate.getDate();
                        const hours = currentDate.getHours();
                        const minutes = currentDate.getMinutes();
                        const seconds = currentDate.getSeconds();
                        if(seconds < 10)
                                loct.innerHTML = "<p> Local Time: </p>" +
                                                                 "<p>" + year + "/" + month  + "/" + day+
                                                                 "<p>" + hours + ":" + minutes  + ":0"+ seconds;
                        else
                                loct.innerHTML = "<p> Local Time: </p>" +
                                                                 "<p>" + year + "/" + month  + "/" + day+
                                                                 "<p>" + hours + ":" + minutes  + ":" + seconds;

            const outputBytes = CyraTime._malloc(50);
            curtime(outputBytes);
            /** @type string */
            var output = CyraTime.UTF8ToString(outputBytes).slice(0, -1);
            CyraTime._free(outputBytes);
                
                        if(output.charAt(output.length - 2) == ':')
                                output = output.substring(0, output.length - 1) + '0' + output.charAt(output.length - 1);
                        const outputString = "<p> HaYi Time: </p>" +
                                                   "<p>" + output.substring(0, output.indexOf(' ')) + "</p>" + 
                                                   "<p>" + output.substring(output.indexOf(' ')+1) + "</p>";
                        divt.innerHTML = outputString;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
}, {
    arguments: ["e"],
});

