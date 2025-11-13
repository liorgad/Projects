package App;

import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;

//import javax.swing.JOptionPane;
import javax.swing.Timer;

public class DAN_TECH_Online {
	public static void main(String[] args) {
		
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				DAN_TECH();
			}
		});
	}

	public static void DAN_TECH() {
		//-------------- READ from SERIAL PORT!--------------//////
	    int delay2 =300; //milliseconds
	      ActionListener taskPerformer2 = new ActionListener() {
	          public void actionPerformed(ActionEvent evt) {	        	  
	              try {
					if(SerialPORTS.input.available()>0 ){  
							SerialPORTS.ReadData();		
							DataRS485.Comparation();									
					  }
					//else System.out.println("Connected Please to battery");
				} catch (IOException e) {
					System.out.println("Connected Please");
				}		                
	          }
	      };
	      new Timer(delay2, taskPerformer2).start();			
//////**************************************--------------//////////		
//////**************************************--------------//////////		
		// New timer3 which works!//////READ from SERIAL PORT
		int delay3 =1000; //milliseconds
		ActionListener taskPerformer3 = new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				//if(GUI.GUIVisible==false & DataRS485.WORKDAN==true){
					//if(DataRS485.ReadSettings64_2==false & DataRS485.ReadSettings64_1==false){
					if(DataRS485.TakeData==false && DataRS485.verread==true){
							SerialPORTS.writeData(":000952000EFA~");
					}
					else if(DataRS485.TakeData==false && DataRS485.burn==true){
					
						if (DataRS485.pass==true) {}
							//ProBurning.Burning();
						else
							SerialPORTS.writeData(":00195200180882175278F5~");
						
					}
					else if (DataRS485.TakeData==false){
						SerialPORTS.writeData(":000200000E08~");
					}   
			}
				//}
			 };
		new Timer(delay3, taskPerformer3).start();	
		
//////**************************************--------------//////////	
	}

	

}
