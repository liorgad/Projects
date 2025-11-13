package App;



public class DataRS485 {
	public static String Request,heattstart,Heattend,Cdprordly,Cdprolock,
	Cdproval_1,Cdpropdly_1,	Cdprordly_1,Cdprolock_1,Shortval,ShortRel,
	Shortrdly,	Shortlock,Heaten,Tfethpro,Tfethrel,Tfetlpro,
	Tfetlrel,Ccproval,Ccpropdly,Ccprordly,ccprolock,Cdproval,Cdpropdly,
	CTcellLPro,Ctcelllrel,	Dtcellghpro,Dtcellhrel,Dtcelllpro,pEnergy,
	DTcellLRel,EngDesing,Tenvhpro,Tenvhrel,Tenvlpro,Tenvlrel,WTFETL,TempNum,	
	WCURRC,WCURRD,WVDIFFH,WVDIFFL,OVPVAL,OVPDLY,OVPREL,UVPVAL,UVPDLY,
	BVDiff,WTenVH,WTenVL,WTFETH,BModel,Vref,Rsense,WTCellL,BlanceState,
	WTCellH,WVBatL,WVBatH,WVCellL,WVCellH,Addr="00",Cmd,Ver,Len,Addr2,
	CSGLimit,CellNum,Vstar,TlDis,THDis,UVPREL,BOVPDLY,BUVPVAL,BUVPDLY,
	BOVPREL,CTcellHPro,CTcellHRel,BOVPVAL,BUVPREL,CRC="",VoltageB,Vcell[]=new String[20],CurrentCB,WorkState,
	CurrentDB,TemperatureB[]=new String[5],TemperatureB1,TemM,VState,CState,TState,Alarm,FETState,DataB,WARN_VOV,WARN_VUV,WARN_VHIGH,WARN_VLOW,Balance,Dch_Num,ChgNum,SOC,CapNow,CapFull;
	
	public static String SAdrr,SCmd,SVer,SLen,SAdrr2,SCellNum,SCSGLimit,SEngDesing,SRsense,SVref,SBModel,STHDis,STlDis,SVstar,SBVDiff,SWVCellH,SWVCellL,SWVBatH,SWVBatL,SWTCellH,
	SWTCellL,SWTenVH,SWTenVL,SWTFETH,SWTFETL,SWCURRC,SWCURRD,SWVDIFFH,SWVDIFFL,SOVPVAL,SOVPDLY,SOVPREL,SUVPVAL,SUVPDLY,SUVPREL,SBOVPVAL,SBOVPDLY,SBOVPREL,SBUVPVAL,
	SBUVPDLY,SBUVPREL,	SCTcellHPro,SCTcellHRel,SCTcellLPro,SCtcelllrel,SDtcellghpro,SDtcellhrel,SDtcelllpro,SDTcellLRel,STenvhpro,STenvhrel,STenvlpro,STenvlrel,
	STfethpro,STfethrel,STfetlpro,STfetlrel,SCcproval,SCcpropdly,SCcprordly,Sccprolock,SCdproval,SCdpropdly,SCdprordly,SCdprolock,SCdproval_1,SCdpropdly_1,SCdprordly_1,SCdprolock_1,
	SShortval,SShortrdly,SShortRel,SShortlock,SHeaten,Sheattstart,SHeattend,DataPassAdrr="300", chek, BSer;
	
	public static String example=(":02815200EA010700030C00190CE4015A230FA0001E10040C1C380E2A625F285F28692809C4138803E80384109A006410040A8C00640C1C396C00C8380E27A600C82A625F5A282B6E64141978641419786E000F09C400640BB80003177000640BB800031B58000A0BB800030103E8000300232D66~"),
			example2=(":0182640070FF7BFFC00D124E124E124E124E124E124E12551262126C1275127D1288129300000000024542D004030000000000000764A3~"),Settingsscren; 
	public static float EngDesingflt,Rsenseflt;
	public static int DataN[] = new int [250],LenB,dir0,dir1,dir2,dir3,DataHe[] = new int [4],Vrefflt,THDisflt,TlDisflt,Vstarflt,
			BVDiffflt,WVCellHflt,WVCellLflt,WTCellHflt,WTCellLflt,WTenVHflt,WTenVLflt,WTFETHflt,WTFETLflt,WVDIFFHflt,
			WVDIFFLflt,OVPVALflt,OVPDLYflt,OVPRELflt,UVPVALflt,UVPDLYflt,UVPRELflt,BOVPDLYflt,CTcellHProflt,CTcellHRelflt,
			CTcellLProflt,Ctcelllrelflt,Dtcellghproflt,Dtcellhrelflt,Dtcelllproflt,DTcellLRelflt,Tenvhproflt,Tenvhrelflt,
			Tenvlproflt,Tenvlrelflt,Tfethproflt,Tfethrelflt,Tfetlproflt,Tfetlrelflt,ccprolockflt,Ccprordlyflt,Ccpropdlyflt,
			Cdpropdlyflt,Cdprordlyflt,Cdprolockflt,Cdpropdly_1flt,Cdprordly_1flt,Cdprolock_1flt,Shortvalflt,ShortRelflt,Shortlockflt,
			heattstartflt,Heattendflt;

	public static double WVBatHflt,WVBatLflt,WCURRCflt,WCURRDflt,BOVPVALflt,BOVPRELflt,BUVPVALflt,BUVPDLYflt,BUVPRELflt,
	Ccprovalflt,Cdprovalflt,Cdproval_1flt;
	
	public static boolean VisibleON,ReadSettings64_1,ReadSettings64_2,TakeData,CreateNewOnline,Admin,WORKDAN, success1, pass, data, burn, verchek=false, verread;
	
	public static int InsM;
	
///////*******-------Comparation----------/////////
	public static void Comparation() {	
		String Datar = GUI.DataR;
		for(int m=0;m<Datar.length();m++){
			DataN[m]=Datar.charAt(m);
			//DataN[m]=Datar.substring(m,m+1);//Other methode
			//System.out.println("Data"+m+": "+DataN[m]+ " "+ (char)DataN[m]+ " "+( (int)DataN[m]-48));
			}	
		System.out.println( GUI.DataR);
		
		GUI.DataR=("");
		int posF=Datar.indexOf("~");
		if (DataN[0]==58 & posF!=-1){			
///---Addr---///////		
			dir0=1;dir1=2;
			Addr = String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[dir1]);
//			GUI.textAddr.setText(""+Integer.parseInt(Addr, 16));	
///---Cmd---///////		
//			Cmd = 0x01, Info is empty;
//			Receiving Cmd = 0x81,
//			Info reads as follows;
//			Modify the protection parameters: Cmd = 0x05,
//			info as follows;
//			Cmd = 0x8A return success or failure Cmd = 0x8B
//////
//			Request real-time information Cmd = 0x02,
//			info is empty; returns Cmd = 0x82,
//			
			Cmd = String.valueOf((char)DataN[3])+String.valueOf((char)DataN[4]);	
//			GUI.textCmd.setText(Cmd);
			System.out.println("CMD: "+Cmd);
///---Ver---///////			
			Ver = String.valueOf((char)DataN[5])+String.valueOf((char)DataN[6]);
			//Firstchek.Bver.setText(Ver);
			//Firstchek.Bmsver.setText(Enterpanel.ver1);
			
			
//			GUI.textVer.setText(Ver);	
			//System.out.println("Version: "+Ver);
///---Len---///////				
			Len = String.valueOf((char)DataN[7])+String.valueOf((char)DataN[8])+String.valueOf((char)DataN[9]+String.valueOf((char)DataN[10]));			
			LenB=Integer.valueOf(Len, 16);
			
//			GUI.textLen.setText(""+LenB);	
/////---Addr2---///////	
//			dir0=11;dir1=12;
//			Addr2 = String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[dir1]);
//			GUI.textAddr2.setText(""+Integer.parseInt(Addr2, 16));	
			data=true;			
			//int temp=Integer.parseInt(Cmd,16);
			if (LenB==16)	{
				data=false;
				chek = String.valueOf((char)DataN[11])+String.valueOf((char)DataN[12])+String.valueOf((char)DataN[13])+String.valueOf((char)DataN[14]);
				if (Integer.parseInt(chek)==1993)
					pass=true;
				if (Integer.parseInt(chek)==598) {
					burn=false;
					//Production.Burn.setVisible(true);
				}
			}
			
			
			
			if(LenB<50 && LenB>16) {
				data=false;
				chek = String.valueOf((char)DataN[11])+String.valueOf((char)DataN[12])+String.valueOf((char)DataN[13])+String.valueOf((char)DataN[14])+String.valueOf((char)DataN[15])+String.valueOf((char)DataN[16])+String.valueOf((char)DataN[17])+String.valueOf((char)DataN[18])+String.valueOf((char)DataN[19])+String.valueOf((char)DataN[20])
						+String.valueOf((char)DataN[21])+String.valueOf((char)DataN[22])+String.valueOf((char)DataN[23])+String.valueOf((char)DataN[24])+String.valueOf((char)DataN[25])+String.valueOf((char)DataN[26])+String.valueOf((char)DataN[27])+String.valueOf((char)DataN[28])+String.valueOf((char)DataN[29])+String.valueOf((char)DataN[30])
						+String.valueOf((char)DataN[31])+String.valueOf((char)DataN[32])+String.valueOf((char)DataN[33])+String.valueOf((char)DataN[34])+String.valueOf((char)DataN[35])+String.valueOf((char)DataN[36]);
				System.out.println(chek);
				if(chek.contains(BSer)==true)
					verchek=true;
				else
					verchek=false;
				
				verread=false;
			}
			
			if (InsM == -1){	
				TakeData=true;
			//	VerIns1.main(null);
				Menupanel.run1 = true;
			}
				
///***********------------Version 1 64-Read DATA ONLINE------------//////////////	"ZLBC4_lib_Li_LS_KEY_V13"		
		//if(Ver.equals("52") & temp==129){////CMD 82	
			if(Ver.equals("52")&&data==true){////CMD 82	
			  	
									 	
			
//--DataB--**//Decimal to HEX	
////Time_t: time, expressed in seconds,
//			1970-01-01 00:00:00 UTC 0 Shi to the number of seconds zone
			
			DataB = String.valueOf((char)DataN[11])+String.valueOf((char)DataN[12])+String.valueOf((char)DataN[13])+String.valueOf((char)DataN[14])
			+String.valueOf((char)DataN[15])+String.valueOf((char)DataN[16])+String.valueOf((char)DataN[17])+String.valueOf((char)DataN[18]);			
			
////--Vbat-VoltageB-//	
	   			VoltageB= String.valueOf((char)DataN[25])+String.valueOf((char)DataN[26])+String.valueOf((char)DataN[27])+String.valueOf((char)DataN[28]);///*0.5
	   			//Firstchek.textVoltageB=VoltageB;
//--CellNum--//	
				CellNum= String.valueOf((char)DataN[29])+String.valueOf((char)DataN[30]);
				
				//Firstchek.textCellNum.setText(String.valueOf(celln));
				//Firstchek.cellNum=CellNum;
				
//--Voltage[n]-Vcell[]-//:0182640070FF7BFFC00D124
				dir0=Integer.parseInt(CellNum,16);					
				int counter = 1;
				for(int n=0;dir0>n;n++){		
					Vcell[n]=String.valueOf((char)DataN[(n*4)+31])+String.valueOf((char)DataN[(n*4)+32])+
							String.valueOf((char)DataN[(n*4)+33])+String.valueOf((char)DataN[(n*4)+34]);
					//Firstchek.textVcell[n]=Vcell[n];
					counter=counter+4;
				}
				dir0=34+counter-4;
				
//--CurrentCB--//	
				CurrentCB= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[dir0+1]+String.valueOf((char)DataN[dir0+2])+String.valueOf((char)DataN[dir0+3]));///	
				dir0=dir0+4;
//--CurrentDB--//	
				CurrentDB= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[dir0+1])+String.valueOf((char)DataN[dir0+2])+String.valueOf((char)DataN[dir0+3]);///	
				dir0=dir0+4;
//--TempNum--//	
				TempNum= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[1+dir0]);///	
				dir0=dir0+2;					
//--TemperatureB--//	
				int add1=Integer.parseInt (TempNum,16);
				
				for(int n=0;add1>n;n++){	
					
					TemperatureB[n]= String.valueOf((char)DataN[(n*2)+dir0])+String.valueOf((char)DataN[(n*2)+dir0+1]);///	+40 !!!! ////
					counter=counter+2;
				}
				
				dir0=dir0+counter-2;
				
//				TemperatureB= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[dir0+1]);///	+40 !!!! ////
//				dir0++;dir0++;
				
				
//--WorkState--//	
				WorkState= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[1+dir0])+String.valueOf((char)DataN[dir0+2])+String.valueOf((char)DataN[dir0+3]);///	
				dir0=dir0+4;				
//--Alarm--//	
				Alarm= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[1+dir0])+String.valueOf((char)DataN[dir0+2])+String.valueOf((char)DataN[dir0+3]);///	
				dir0=dir0+4;
//--BlanceState--//	
				BlanceState= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[1+dir0])+String.valueOf((char)DataN[dir0+2])+String.valueOf((char)DataN[dir0+3]);///	
				dir0=dir0+4;
//--Dch_Num--//	
				Dch_Num= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[1+dir0])+String.valueOf((char)DataN[2+dir0])+String.valueOf((char)DataN[3+dir0]);///	
				dir0=dir0+4;
//--ChgNum--//	
				ChgNum= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[1+dir0])+String.valueOf((char)DataN[2+dir0])+String.valueOf((char)DataN[3+dir0]);///	
				dir0=dir0+4;
//--pEnergy--//		
				pEnergy= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[dir0+1]);///10%
				dir0=dir0+5;
////--CapNow--//	
//				CapNow= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[1+dir0]);///	
//				dir0=dir0+2;
				CapNow="0";
////--CapFull--//	
				CapFull="0";
//				CapFull= String.valueOf((char)DataN[dir0])+String.valueOf((char)DataN[1+dir0]);///	
//				dir0=dir0+2;				
//				if(DataPassAdrr.equals(Addr) & ReadSettings64_1==true){
//					CreateNewOnline=false;
//					DataRS485.TakeData=true;					
//				}
//				else{
//					CreateNewOnline=true;
//				}
//				if(LenB==dir0 & ReadSettings64_1==true & CreateNewOnline==true){
//					ONline1 = new GuiOnline(DataRS485.Addr);	
//	            	  ONline1.setVisible(true);
//	            	  DataPassAdrr=Addr;
//	            	DataRS485.TakeData=true;
//					//ReadSettings64_2=false;///If Settings V2 Readed	            	
//					CreateNewOnline=false;
//				}	
				TakeData=true;
				
				if (InsM == 0){} /*	
					IncomIns1.main(null);
					Menupanel.run1 = true;
				}
				else if(InsM == 1) 
					IncomIns2.main(null);
				else if(InsM == 2)
					IncomIns3.main(null);
			
				
				else if (InsM==3) {
					ProIns1.main(null);
					Menupanel.run1 = true;
				}
				else if (InsM==4)
					ProIns2.main(null);
				else if (InsM==5)
					ProIns3.main(null);
				else if (InsM==6)
					ProIns4.main(null);  */
				else if (InsM==7)
					Displaydata.main(null);
				
		}
		}
	}
	
	
}
		
