import * as os from "os";
import * as dns from "dns";
import Traceroute from "nodejs-traceroute";
import * as child_process from "child_process";


console.log("Test");

// This function will output the lines from the script 
// AS is runs, AND will return the full combined output
// as well as exit code when it's done (using the callback).
function run_script(command, args, callback) {
    //console.log("Starting Process.");
    var child = child_process.spawn(command, args);

    var scriptOutput = "";

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
        //console.log('stdout: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
       // console.log('stderr: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.on('close', function(code) {
        callback(scriptOutput,code);
    });
}

const ifcInfo: [] = os.networkInterfaces();

// (async () => {
//     const response = await fetch("https://download.mce-sys.com/Tests/123456789ABCDEF.txt", {
//         method: "GET",
//         headers: {
//             Accept: "application/json, application/xml, text/plain, text/html, *.*",
//             "Content-Type": "charset=utf-8",
//         },
//     });
//     return response;
// })();


const actualifcs = [];

Object.keys(ifcInfo).forEach(function (key) {


    const result = ifcInfo[key].filter((info) => (<string>info.family).toLowerCase() === "ipv4");
    if (result && !result[0].internal && 
        !key.toLowerCase().includes("virtual") && 
        !key.toLowerCase().includes("vethernet") && 
        !key.toLowerCase().includes("loopback")) {
        actualifcs.push({ name:key,...result[0]});
    }
    // console.log(key, ifcInfo[key]);
});

// try {
//     const tracer = new Traceroute();
//     tracer
//         .on('pid', (pid) => {
//             console.log(`pid: ${pid}`);
//         })
//         .on('destination', (destination) => {
//             console.log(`destination: ${destination}`);
//         })
//         .on('hop', (hop) => {
            
//             console.log(`hop: ${JSON.stringify(hop)}`);
            
//         })
//         .on('close', (code) => {
//             console.log(`close: code ${code}`);
//         });
 
//     tracer.trace('download.mce-sys.com');
// } catch (ex) {
//     console.log(ex);
// }
    


console.log(`ifcInfo = ${JSON.stringify(actualifcs, null, 2)}`);
// console.log(`actualifcs = ${JSON.stringify(actualifcs, null, 2)}`);
// console.log(`dns = ${JSON.stringify(dns.getServers(), null, 2)}`);

// const proc = child_process.spawn("netsh",["interface","ipv4","show","interfaces"],process.env);
// proc.stdout.pipe(process.stdout);
// proc.on("message", (code, signal) => { 
//     console.log("message");
// })
// proc.on("close", (code, signal) => { 
//     process.exit(code);
// })

run_script("netsh", ["interface", "show", "interface"], (output:string, code) => { 
    let ifcsArr = interfacesParser(output);
    console.log(ifcsArr);
})

run_script("netsh", ["wlan", "show", "interface"], (output: string, code) => { 
    let ifcsObj = wlanParser(output);
   
    console.log(ifcsObj);
})




console.log("finished...");

function wlanParser(output: string) {
    let test: string[] = output.split("\r\n");
    test = test.filter((s) => s !== '');
    test = test.slice(1);
    let ifcsObj = {};
    for (let i = 0; i < test.length; i++) {
        let parameters = test[i].split(":").filter((s) => s !== '');
        parameters = parameters.map((w) => w.trim());
        if (parameters[0].toLowerCase() === "name") {
            ifcsObj["name"] = parameters[1];
        }
        if (parameters[0].toLowerCase() === "state") {
            ifcsObj["state"] = parameters[1];
        }
    }
    return ifcsObj;
}

function interfacesParser(output: string) {
    let test: string[] = output.split("\r\n");
    test = test.filter((s) => s !== '');
    let ifcsArr = [];
    for (let i = 2; i < test.length; i++) {
        let parameters = test[i].split("  ").filter((s) => s !== '');
        parameters = parameters.map((w) => w.trim());
        const ifc = {
            name: parameters[3],
            state: parameters[1].toLowerCase()
        };
        ifcsArr.push(ifc);
    }
    return ifcsArr;
}
