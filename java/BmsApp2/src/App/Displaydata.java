package App;

import java.awt.EventQueue;

public class Displaydata extends Viewpanel{

	public static void main(String[] args) {
		
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				display();
			}
		});
	}

	public static void display() {
		double A0,A1, vmax=0,vmin=4200;
		double [] s = new double[16];
		txtpnSerials.setText(hex2Decimal(DataRS485.CellNum)+"s");
		textPane_Batv.setText((double)(hex2Decimal(DataRS485.VoltageB)*2)/1000+"V");
		progressBarVbat.setMaximum(4250*hex2Decimal(DataRS485.CellNum));
		progressBarVbat.setMinimum(2500*hex2Decimal(DataRS485.CellNum));
		progressBarVbat.setValue(hex2Decimal(DataRS485.VoltageB)*2);
		
		A0=hex2Decimal(DataRS485.CurrentCB);
		txtpnA.setText((A0/1000)+"A");
		A1=hex2Decimal(DataRS485.CurrentDB);
		txtpnA_1.setText((A1/1000)+"A");
		
		txtpnC_0.setText(hex2Decimal(DataRS485.TemperatureB[0])-40+"c");
		txtpnC_1.setText(hex2Decimal(DataRS485.TemperatureB[1])-40+"c");
		if (hex2Decimal(DataRS485.TempNum)>2)
			txtpnC_2.setText(hex2Decimal(DataRS485.TemperatureB[2])-40+"c");
		if (hex2Decimal(DataRS485.TempNum)>3)
			txtpnC_3.setText(hex2Decimal(DataRS485.TemperatureB[3])-40+"c");
		if (hex2Decimal(DataRS485.TempNum)>4)
			txtpnC_4.setText(hex2Decimal(DataRS485.TemperatureB[4])-40+"c");
		
		for(int k=0;k<hex2Decimal(DataRS485.CellNum);k++) {
			if(k==0) {
			progressBar_1.setValue(hex2Decimal(DataRS485.Vcell[k]));
			progressBar_1.setVisible(true);
			s[k]=hex2Decimal(DataRS485.Vcell[k]);
			textPane_1.setText((s[k]/1000)+"v");
			textPane_1.setVisible(true);
			txtpnS_0.setVisible(true);
			}
			else if(k==1) {
				progressBar_2.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_2.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_2.setText((s[k]/1000)+"v");
				textPane_2.setVisible(true);
				txtpnS_1.setVisible(true);
				}
			else if(k==2) {
				progressBar_3.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_3.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_3.setText((s[k]/1000)+"v");
				textPane_3.setVisible(true);
				txtpnS_2.setVisible(true);
				}
			else if(k==3) {
				progressBar_4.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_4.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_4.setText((s[k]/1000)+"v");
				textPane_4.setVisible(true);
				txtpnS_3.setVisible(true);
				}
			else if(k==4) {
				progressBar_5.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_5.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_5.setText((s[k]/1000)+"v");
				textPane_5.setVisible(true);
				txtpnS_4.setVisible(true);
				}
			else if(k==5) {
				progressBar_6.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_6.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_6.setText((s[k]/1000)+"v");
				textPane_6.setVisible(true);
				txtpnS_5.setVisible(true);
				}
			else if(k==6) {
				progressBar_7.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_7.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_7.setText((s[k]/1000)+"v");
				textPane_7.setVisible(true);
				txtpnS_6.setVisible(true);
				}
			else if(k==7) {
				progressBar_8.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_8.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_8.setText((s[k]/1000)+"v");
				textPane_8.setVisible(true);
				txtpnS_7.setVisible(true);
				}
			else if(k==8) {
				progressBar_9.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_9.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_9.setText((s[k]/1000)+"v");
				textPane_9.setVisible(true);
				txtpnS_8.setVisible(true);
				}
			else if(k==9) {
				progressBar_10.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_10.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_10.setText((s[k]/1000)+"v");
				textPane_10.setVisible(true);
				txtpnS_9.setVisible(true);
				}
			else if(k==10) {
				progressBar_11.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_11.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_11.setText((s[k]/1000)+"v");
				textPane_11.setVisible(true);
				txtpnS_10.setVisible(true);
				}
			else if(k==11) {
				progressBar_12.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_12.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_12.setText((s[k]/1000)+"v");
				textPane_12.setVisible(true);
				txtpnS_11.setVisible(true);
				}
			else if(k==12) {
				progressBar_13.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_13.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_13.setText((s[k]/1000)+"v");
				textPane_13.setVisible(true);
				txtpnS_12.setVisible(true);
				}
			else if(k==13) {
				progressBar_14.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_14.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_14.setText((s[k]/1000)+"v");
				textPane_14.setVisible(true);
				txtpnS_13.setVisible(true);
				}
			else if(k==14) {
				progressBar_15.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_15.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_15.setText((s[k]/1000)+"v");
				textPane_15.setVisible(true);
				txtpnS_14.setVisible(true);
				}
			else if(k==15) {
				progressBar_16.setValue(hex2Decimal(DataRS485.Vcell[k]));
				progressBar_16.setVisible(true);
				s[k]=hex2Decimal(DataRS485.Vcell[k]);
				textPane_16.setText((s[k]/1000)+"v");
				textPane_16.setVisible(true);
				txtpnS_15.setVisible(true);
				}
			
			if (s[k]>vmax)
				vmax=s[k];
			
			if (s[k]<vmin)
				vmin=s[k];
		}
		
		txtpnV.setText((vmax/1000)+"V");
		txtpnV_1.setText((vmin/1000)+"V");
		txtpnV_2.setText((vmax-vmin)+"mV");
		
		DataRS485.TakeData=false;
	}
	
	
	public static int hex2Decimal(String s) {
        String digits = "0123456789ABCDEF";
        s = s.toUpperCase();
        int val = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            int d = digits.indexOf(c);
            val = 16*val + d;
        }
        return val;
    }
}
