var currentDate = new Date();

// load the wasm module
var script = document.createElement('script');
script.src = 'https://template.she-a.eu/js/time.js';
document.head.appendChild(script);
var curtime;

var divt = document.getElementById('HaYiTime');
var loct = document.getElementById('LocalTime');
var divb = document.getElementById('HaYiTimeBau');
var locb = document.getElementById('LocalTimeBau');

showdivt = false;
showdivb = false;
showloct = false;
showlocb = false;
function bauShift(inp){
	oup ="";
	for(const c of inp){
		if(c.charCodeAt(0) < 65)
			oup += (String.fromCharCode(''.charCodeAt(0)+(c.charCodeAt(0) - 48)));
		else if(c.charCodeAt(0) < 97)
			oup += (String.fromCharCode(''.charCodeAt(0)+ 10 + (c.charCodeAt(0) - 65)));
		else
			oup += (String.fromCharCode(''.charCodeAt(0)+ 10 + (c.charCodeAt(0) - 97)));
	}
	return oup;
}
function bauMonth(inp){
	oup ="";
	for(const c of inp){
		if(c.charCodeAt(0) < 65)
			oup += (String.fromCharCode(''.charCodeAt(0)+(c.charCodeAt(0) - 48)));
		else if(c.charCodeAt(0) < 97)
			oup += (String.fromCharCode(''.charCodeAt(0)+ 10 + (c.charCodeAt(0) - 65)));
		else
			oup += (String.fromCharCode(''.charCodeAt(0)+ 10 + (c.charCodeAt(0) - 97)));
	}
	return oup;

}
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
						if(showloct == true){
							loct.style.display = "contents";
							loct.innerHTML = "<p> Local Time: </p>" +
															 "<p>" + year + "/" + month  + "/" + day + "</p>" +
															 "<p>" + hours + ":"  + (minutes < 10? "0" : "" ) + minutes  + ":" + (seconds < 10? "0" : "" )+ seconds + "</p>";	
						}
						else 
							loct.style.display = "none";
						if(showlocb == true){
							locb.style.display = "contents";
							locb.innerHTML = "<p>  </p>" +
															 "<p> " + bauShift(year.toString(16))+       bauMonth(month.toString(16))   +       bauShift(day.toString(16)) + "</p>" +
															 "<p>" + bauShift(hours.toString(16)) + ""  + (minutes < 16? "" : "" ) + bauShift(minutes.toString(16)) + "" + (seconds < 16? "" : "" )+ bauShift(seconds.toString(16)) + "</p>";
						}
						else
							locb.style.display = "none";
							//console.log(locb.innerHTML);
						

            const outputBytes = CyraTime._malloc(50);
            curtime(outputBytes);
            /** @type string */
            var output = CyraTime.UTF8ToString(outputBytes).slice(0, -1);
            CyraTime._free(outputBytes);
                
                        if(output.charAt(output.length - 2) == ':')
                                output = output.substring(0, output.length - 1) + '0' + output.charAt(output.length - 1);
						if(showdivt == true){
							divt.style.display = "contents";
							divt.innerHTML = "<p> HaYi Time: </p>" +
													   "<p>" + output.substring(0, output.indexOf(' ')) + "</p>" + 
													   "<p>" + output.substring(output.indexOf(' ')+1) + "</p>";
						}
						else
							divt.style.display = "none";
						if(showdivb == true){
							divb.style.display = "contents";
							divb.innerHTML = "<p>  </p>" +
											 "<p>" + bauShift(output.substring(0, output.indexOf('/'))) + bauMonth(output.charAt(5)) 
												   + bauShift(output.charAt(7)) + ( output.charAt(8) == "W"? "" : ( output.charAt(8) == "H"? "" : "" ) ) + "</p>" + 
											 "<p>" + bauShift(output.charAt(10)) + "" + (output.charAt(11) == 'x'? "" : "" ) + bauShift(output.substring(12,14))  + (output.charAt(11) == 'x'? "" : "" )  + "" + bauShift(output.substring(15))+ "</p>";
						}
						else
							divb.style.display = "none";
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
}, {
    arguments: ["e"],
});

document.querySelectorAll('.TimeOption').forEach(cell => {
    cell.addEventListener('click', () => {
		if(cell.id == "TimeLatLat")
			showloct = !showloct;
		if(cell.id == "TimeLatBau")
			showlocb = !showlocb;
		if(cell.id == "TimeBauLat")
			showdivt = !showdivt;
		if(cell.id == "TimeBauBau")
			showdivb = !showdivb;
		cell.innerHTML = ( cell.innerHTML == ""? "":"");
		if(cell.innerHTML == "")
			cell.style.backgroundColor = "#313244";
		else
			cell.style.backgroundColor = "#1e1e2e";
    });
  });

