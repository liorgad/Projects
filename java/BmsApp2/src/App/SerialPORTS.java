
package App;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;

import gnu.io.CommPortIdentifier;
import gnu.io.SerialPort;

import java.io.IOException;

public class SerialPORTS {		
	
	private static final String PORT_NAMES[] = {
			"/dev/tty.usbserial-A9007UX1", // Mac OS X
			"/dev/ttyUSB0", // Linux
			"COM11", // Windows
			"","","","",""};



	private static final CommPortIdentifier COM3 = null;
	
	
	
	public static String PortToUse;
	public static  CommPortIdentifier PortId = null;
	public static SerialPort serialPort;
	public static InputStream input;
	public static OutputStream output;
	
	static int n = 0;
	public static String port[] = {"","","","","","","","","",""};	
	
	public static void SerialPORTS() {
		Enumeration<?> enumComm = CommPortIdentifier.getPortIdentifiers();///Search all ports USB
		System.out.println("Loanding USB ports...");
		
		//First, Find an instance of serial port as set in PORT_NAMES.
		while (enumComm.hasMoreElements()) {
		CommPortIdentifier currPortId = (CommPortIdentifier) enumComm.nextElement();
			for (String portName : PORT_NAMES) {
			n++;
			PortId = currPortId;
			System.out.print(PortId.getName());
			port[n]=PortId.getName();
			break;
			
			}
		}
		if (PortId == null) {
			System.out.println("Could not find COM port.");
			return;
			}
		
	}
	public static void SerialOpen() {
		
		Enumeration<?> enumComm2 = CommPortIdentifier.getPortIdentifiers();///Search all ports USB
			while (enumComm2.hasMoreElements()) {
				CommPortIdentifier currPortId = (CommPortIdentifier) enumComm2.nextElement();
					for (String portName : PORT_NAMES) {
						if(currPortId.getName().equals(PortToUse))
							PortId = currPortId;
						
					}
			}
			// open serial port, and use class name for the appName.
		//	CommPortIdentifier.addPortName(PortToUse, 0, PortId);
			try {
			System.out.println("PortID "+PortId.getName());
			serialPort = (SerialPort) PortId.open("Error the port bussy",3000);
			System.out.println("connected to " + PortId.getName());
			// set port parameters
			serialPort.setSerialPortParams(9600,
			SerialPort.DATABITS_8,
			SerialPort.STOPBITS_1,
			SerialPort.PARITY_NONE);

			// open the streams
			input = serialPort.getInputStream();
			output = serialPort.getOutputStream();
			char ch = 1;
			output.write(ch);
			// ( new Thread( new ReadData( in ) ) ).start();
		     //( new Thread( new SerialWriter( out ) ) ).start();			
//			serialPort.addEventListener(null);
//			serialPort.notifyOnDataAvailable(true);
			} catch (Exception e) {
			System.err.println(e.toString());
			}			
	}
	
	public synchronized void close() {
		if (serialPort != null) {
			serialPort.removeEventListener();
			serialPort.close();
		}
	}
	
//	public synchronized void serialEvent(SerialPortEvent oEvent) {
//		if (oEvent.getEventType() == SerialPortEvent.DATA_AVAILABLE) {
//			try {
//				String inputLine=input.readLine();
//				System.out.println(inputLine);
//				}
//			catch (Exception e) {
//				System.err.println(e.toString());
//				}
//		}
//	}	
	public synchronized static void ReadData() {
		byte[] Buffer = new byte[250];
			
		try{
			
			input.read(Buffer);
			//	System.out.println("Buffer:"+new String(Buffer));				
				GUI.DataR = new String(Buffer);
				
		}catch(IOException e){
			System.out.println("No data readed");
			//e.printStackTrace();
			}			
	}	
	public static synchronized void writeData(String c) {
		System.out.println("Sent: " + c);
		try {
//			GUI.lblS.setVisible(true);
//			GUI.lblR.setVisible(false);	
			output.write(c.getBytes());			
			Thread.sleep(1);			
		} 
		catch (Exception e) {
			System.out.println("could not write to port");
		}		
	}	
	public synchronized static void Request(String Request,int delayT) throws InterruptedException{
		writeData(Request);
		Thread.sleep(delayT);
		System.out.println(Request+delayT);
	}		

}
