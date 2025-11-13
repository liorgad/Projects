package App;

import java.awt.EventQueue;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.util.Stack;

import javax.swing.JLabel;
import javax.swing.Timer;
import javax.swing.JButton;
import javax.swing.JTextField;
import java.awt.Panel;
import java.awt.Label;
import java.awt.Button;
import javax.swing.ImageIcon;
import javax.swing.JComboBox;
import javax.swing.DefaultComboBoxModel;
import java.awt.Font;
import java.awt.Toolkit;

@SuppressWarnings({ "serial", "unused" })
public class GUI extends JFrame {
	
	
	public static String DataR;
	public JPanel contentPane;
	public static JLabel lblS,lblR,lblBOVPVAL,lblBUVPDLY,lblBOVPDLY,lblUVPREL,lblBOVPREL,lblBUVPVAL;
	public static Label lblBUVPREL,lblCellVoltage;
	static Label lblVolBattery;
	
	public static JTextField textRequest,textheattstart,textHeattend,
	textCdprordly,textCdprolock,textCdproval_1,textCdpropdly_1,
	textCdprordly_1,textCdprolock_1,textShortrdly,
	textShortlock,textTfethpro,textTfethrel,textTfetlpro,
	textTfetlrel,textCcproval,textCcpropdly,textCcprordly,textccprolock,
	textCdproval,textCdpropdly,textCTcellLPro,textCtcelllrel,
	textDtcellghpro,textDtcellhrel,textDtcelllpro,textDTcellLRel,
	textTenvhpro,textTenvhrel,textTenvlpro,textTenvlrel,textWTFETL,
	textWCURRC,textWCURRD,textWVDIFFH,textWVDIFFL,textOVPVAL,textOVPDLY,
	textOVPREL,textUVPVAL,textUVPDLY,textBVDiff,textWTenVH,textWTenVL,
	textWTFETH,textVref,textRsense,textEngDesing,textWTCellL,
	textWTCellH,textWVBatL,textWVBatH,textWVCellL,textWVCellH,textAddr,
	textCmd,textVer,textLen,textAddr2,textCSGLimit,textCellNum,
	textVstar,textTlDis,textTHDis,textUVPREL,textBOVPDLY,textBUVPVAL,
	textBUVPDLY,textBOVPREL,textCTcellHPro,textCTcellHRel,textBOVPVAL,textBUVPREL,textShortRel,textCrc;
	public static Panel panel_Alarm,panel_Heating,panel_Battery;
	@SuppressWarnings("rawtypes")
	public static JComboBox comboBoxShortval,comboBoxHeaten,textBModel;
	public static boolean GUIVisible;
	
//	
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					GUI frame = new GUI();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public GUI() {
		GUIVisible=true;///GUI Star
		DataRS485.WORKDAN=false;///Write on Serial PORT DAN_TECH_Online
		setTitle("Settings");
		setIconImage(Toolkit.getDefaultToolkit().getImage(GUI.class.getResource("/LOGO.PNG")));
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 1010, 605);
		contentPane = new JPanel();
		contentPane.setToolTipText("0.1\r\n0.2\r\n0.3\r\n");
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		Panel panel = new Panel();
		panel.setBounds(827, 439, 136, 117);
		contentPane.add(panel);
		panel.setLayout(null);
		
		textRequest = new JTextField();
		textRequest.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textRequest.setBounds(10, 15, 74, 20);
		panel.add(textRequest);
		textRequest.setColumns(10);
		
		JButton btnSendCommand = new JButton("Send");
		btnSendCommand.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
			//	SerialPORTS.writeData(textRequest.getText());:000264000EFE~
				SerialPORTS.writeData(":000264000EFE~");
			}
		});
		btnSendCommand.setBounds(10, 39, 57, 20);
		panel.add(btnSendCommand);
		
		JLabel lblSendCommand = new JLabel("Send Command");
		lblSendCommand.setBounds(24, 0, 83, 14);
		panel.add(lblSendCommand);
		
		Button btnData = new Button("Data");
		btnData.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				SerialPORTS.writeData(":000100000E09~");				
			}
		});
		btnData.setBounds(73, 41, 57, 19);
		panel.add(btnData);
		
		JLabel lblSend = new JLabel("Sended");
		lblSend.setBounds(10, 70, 46, 14);
		panel.add(lblSend);
		
		JLabel lblReceived = new JLabel("Received");
		lblReceived.setBounds(10, 94, 46, 14);
		panel.add(lblReceived);
		
		lblS = new JLabel("");
		lblS.setVisible(false);
		lblS.setIcon(new ImageIcon(GUI.class.getResource("/javax/swing/plaf/metal/icons/ocean/question.png")));
		lblS.setBounds(66, 70, 17, 14);
		panel.add(lblS);
		
		lblR = new JLabel("");
		lblR.setVisible(false);
		lblR.setIcon(new ImageIcon(GUI.class.getResource("/com/sun/java/swing/plaf/windows/icons/Inform.gif")));
		lblR.setBounds(66, 94, 17, 14);
		panel.add(lblR);
		
		panel_Heating = new Panel();
		panel_Heating.setBounds(574, 412, 143, 144);
		contentPane.add(panel_Heating);
		panel_Heating.setLayout(null);
		
		JLabel lblheattstart = new JLabel("HEAT.TSTART");
		lblheattstart.setBounds(10, 60, 68, 14);
		panel_Heating.add(lblheattstart);
		
		textheattstart = new JTextField();
		textheattstart.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textheattstart.setBounds(88, 57, 46, 20);
		panel_Heating.add(textheattstart);
		textheattstart.setColumns(10);
		
		JLabel lblHeattend = new JLabel("HEAT.TEND");
		lblHeattend.setBounds(10, 91, 61, 14);
		panel_Heating.add(lblHeattend);
		
		textHeattend = new JTextField();
		textHeattend.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textHeattend.setBounds(88, 88, 46, 20);
		panel_Heating.add(textHeattend);
		textHeattend.setColumns(10);
		
		JLabel lblHeaten = new JLabel("HEAT.EN");
		lblHeaten.setBounds(10, 32, 54, 14);
		panel_Heating.add(lblHeaten);
		
		JLabel lblHeanting = new JLabel("Heating");
		lblHeanting.setBounds(46, 11, 46, 14);
		panel_Heating.add(lblHeanting);
		
		comboBoxHeaten = new JComboBox();
		comboBoxHeaten.setModel(new DefaultComboBoxModel(new String[] {"OFF", "ON"}));
		comboBoxHeaten.setBounds(84, 26, 46, 20);
		panel_Heating.add(comboBoxHeaten);
		
		JLabel lblCrc = new JLabel("CRC");
		lblCrc.setBounds(10, 119, 61, 14);
		panel_Heating.add(lblCrc);
		
		textCrc = new JTextField();
		textCrc.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCrc.setColumns(10);
		textCrc.setBounds(88, 116, 46, 20);
		panel_Heating.add(textCrc);
		
		Panel panel_Voltage = new Panel();
		panel_Voltage.setBounds(10, 124, 271, 117);
		contentPane.add(panel_Voltage);
		panel_Voltage.setLayout(null);
		
		textOVPVAL = new JTextField();
		textOVPVAL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textOVPVAL.setColumns(10);
		textOVPVAL.setBounds(53, 35, 61, 20);
		panel_Voltage.add(textOVPVAL);
		
		textOVPDLY = new JTextField();
		textOVPDLY.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textOVPDLY.setColumns(10);
		textOVPDLY.setBounds(53, 59, 61, 20);
		panel_Voltage.add(textOVPDLY);
		
		textOVPREL = new JTextField();
		textOVPREL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textOVPREL.setColumns(10);
		textOVPREL.setBounds(53, 83, 61, 20);
		panel_Voltage.add(textOVPREL);
		
		textUVPVAL = new JTextField();
		textUVPVAL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textUVPVAL.setColumns(10);
		textUVPVAL.setBounds(178, 35, 51, 20);
		panel_Voltage.add(textUVPVAL);
		
		textUVPDLY = new JTextField();
		textUVPDLY.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textUVPDLY.setColumns(10);
		textUVPDLY.setBounds(178, 59, 51, 20);
		panel_Voltage.add(textUVPDLY);
		
		JLabel lblOVPVAL = new JLabel("OVPVAL");
		lblOVPVAL.setBounds(10, 38, 46, 14);
		panel_Voltage.add(lblOVPVAL);
		
		JLabel lblOVPDLY = new JLabel("OVPDLY");
		lblOVPDLY.setBounds(10, 62, 46, 14);
		panel_Voltage.add(lblOVPDLY);
		
		JLabel lblOVPREL = new JLabel("OVPREL");
		lblOVPREL.setBounds(10, 86, 46, 14);
		panel_Voltage.add(lblOVPREL);
		
		JLabel lblUVPVAL = new JLabel("UVPVAL");
		lblUVPVAL.setBounds(124, 38, 51, 17);
		panel_Voltage.add(lblUVPVAL);
		
		JLabel lblUVPDLY = new JLabel("UVPDLY");
		lblUVPDLY.setBounds(124, 63, 46, 14);
		panel_Voltage.add(lblUVPDLY);
		
		lblUVPREL = new JLabel("UVPREL");
		lblUVPREL.setBounds(124, 87, 46, 14);
		panel_Voltage.add(lblUVPREL);
		
		textUVPREL = new JTextField();
		textUVPREL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textUVPREL.setBounds(178, 83, 51, 20);
		panel_Voltage.add(textUVPREL);
		textUVPREL.setColumns(10);
		
		Label lbl_Voltage = new Label("Voltage");
		lbl_Voltage.setBounds(10, 10, 61, 19);
		panel_Voltage.add(lbl_Voltage);
		
		Label label_8 = new Label("(mV)");
		label_8.setBounds(235, 35, 28, 19);
		panel_Voltage.add(label_8);
		
		Label label_9 = new Label("(mS)");
		label_9.setBounds(235, 59, 28, 19);
		panel_Voltage.add(label_9);
		
		Label label_10 = new Label("(mV)");
		label_10.setBounds(235, 84, 28, 19);
		panel_Voltage.add(label_10);
		
		Label lblVolCells = new Label("Cells");
		lblVolCells.setBounds(90, 10, 61, 19);
		panel_Voltage.add(lblVolCells);
		
		panel_Alarm = new Panel();
		
		panel_Alarm.setBounds(10, 10, 833, 108);
		contentPane.add(panel_Alarm);
		panel_Alarm.setLayout(null);
		
		Label lblAlarm = new Label("Alarm");
		lblAlarm.setBounds(10, 0, 61, 19);
		panel_Alarm.add(lblAlarm);
		
		lblCellVoltage = new Label("Cell Voltage (mV)");
		lblCellVoltage.setBounds(0, 28, 97, 19);
		panel_Alarm.add(lblCellVoltage);
		
		JLabel lblWVBatL = new JLabel("W.VBat.L");
		lblWVBatL.setBounds(109, 82, 54, 14);
		panel_Alarm.add(lblWVBatL);
		
		textWVBatL = new JTextField();
		textWVBatL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWVBatL.setBounds(169, 78, 46, 20);
		panel_Alarm.add(textWVBatL);
		textWVBatL.setColumns(10);
		
		JLabel lblWVBatH = new JLabel("W.VBat.H");
		lblWVBatH.setBounds(109, 54, 54, 14);
		panel_Alarm.add(lblWVBatH);
		
		textWVBatH = new JTextField();
		textWVBatH.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWVBatH.setBounds(169, 50, 46, 20);
		panel_Alarm.add(textWVBatH);
		textWVBatH.setColumns(10);
		
		Label lblBatVoltage = new Label("BatVoltage (V)");
		lblBatVoltage.setBounds(113, 28, 86, 19);
		panel_Alarm.add(lblBatVoltage);
		
		JLabel lblWVCellH = new JLabel("W.VCell.H");
		lblWVCellH.setBounds(0, 53, 61, 14);
		panel_Alarm.add(lblWVCellH);
		
		textWVCellH = new JTextField();
		textWVCellH.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWVCellH.setBounds(61, 50, 46, 20);
		panel_Alarm.add(textWVCellH);
		textWVCellH.setColumns(10);
		
		textWVCellL = new JTextField();
		textWVCellL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWVCellL.setBounds(61, 78, 46, 20);
		panel_Alarm.add(textWVCellL);
		textWVCellL.setColumns(10);
		
		JLabel lblWVCellL = new JLabel("W.VCell.L");
		lblWVCellL.setBounds(0, 81, 46, 14);
		panel_Alarm.add(lblWVCellL);
		
		Label lblCellTemp = new Label("CellTemp (`C)");
		lblCellTemp.setBounds(736, 28, 61, 19);
		panel_Alarm.add(lblCellTemp);
		
		JLabel lblWTenVH = new JLabel("W.TenV.H");
		lblWTenVH.setBounds(225, 54, 54, 14);
		panel_Alarm.add(lblWTenVH);
		
		textWTenVH = new JTextField();
		textWTenVH.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWTenVH.setBounds(280, 50, 43, 20);
		panel_Alarm.add(textWTenVH);
		textWTenVH.setColumns(10);
		
		JLabel lblWTenVL = new JLabel("W.TenV.L");
		lblWTenVL.setBounds(225, 82, 54, 14);
		panel_Alarm.add(lblWTenVL);
		
		textWTenVL = new JTextField();
		textWTenVL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWTenVL.setBounds(280, 78, 43, 20);
		panel_Alarm.add(textWTenVL);
		textWTenVL.setColumns(10);
		
		Label lblEnvTemp = new Label("EnvTemp (`C)");
		lblEnvTemp.setBounds(225, 28, 77, 19);
		panel_Alarm.add(lblEnvTemp);
		
		Label lblFetTemp = new Label("FetTemp (`C)");
		lblFetTemp.setBounds(333, 28, 77, 19);
		panel_Alarm.add(lblFetTemp);
		
		JLabel lblWTFETH = new JLabel("W.TFET.H");
		lblWTFETH.setBounds(333, 54, 61, 14);
		panel_Alarm.add(lblWTFETH);
		
		textWTFETH = new JTextField();
		textWTFETH.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWTFETH.setBounds(388, 50, 43, 20);
		panel_Alarm.add(textWTFETH);
		textWTFETH.setColumns(10);
		
		JLabel lblWTFETL = new JLabel("W.TFET.L");
		lblWTFETL.setBounds(333, 82, 55, 14);
		panel_Alarm.add(lblWTFETL);
		
		textWTFETL = new JTextField();
		textWTFETL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWTFETL.setBounds(388, 78, 43, 20);
		panel_Alarm.add(textWTFETL);
		textWTFETL.setColumns(10);
		
		Label lblCurrent = new Label("Current (A)");
		lblCurrent.setBounds(441, 28, 61, 19);
		panel_Alarm.add(lblCurrent);
		
		JLabel lblWCURRC = new JLabel("W.CURR.C");
		lblWCURRC.setBounds(441, 54, 61, 14);
		panel_Alarm.add(lblWCURRC);
		
		textWCURRC = new JTextField();
		textWCURRC.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWCURRC.setBounds(505, 50, 46, 20);
		panel_Alarm.add(textWCURRC);
		textWCURRC.setColumns(10);
		
		JLabel lblWCURRD = new JLabel("W.CURR.D");
		lblWCURRD.setBounds(441, 82, 61, 14);
		panel_Alarm.add(lblWCURRD);
		
		textWCURRD = new JTextField();
		textWCURRD.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWCURRD.setBounds(508, 78, 43, 20);
		panel_Alarm.add(textWCURRD);
		textWCURRD.setColumns(10);
		
		Label lblDifferent = new Label("Different (mV)");
		lblDifferent.setBounds(579, 28, 75, 19);
		panel_Alarm.add(lblDifferent);
		
		JLabel lblWVDIFFH = new JLabel("W.VDIFF.H");
		lblWVDIFFH.setBounds(561, 54, 72, 14);
		panel_Alarm.add(lblWVDIFFH);
		
		textWVDIFFH = new JTextField();
		textWVDIFFH.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWVDIFFH.setBounds(643, 50, 55, 20);
		panel_Alarm.add(textWVDIFFH);
		textWVDIFFH.setColumns(10);
		
		JLabel lblWVDIFFL = new JLabel("W.VDIFF.L");
		lblWVDIFFL.setBounds(561, 82, 72, 14);
		panel_Alarm.add(lblWVDIFFL);
		
		textWVDIFFL = new JTextField();
		textWVDIFFL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWVDIFFL.setBounds(643, 78, 55, 20);
		panel_Alarm.add(textWVDIFFL);
		textWVDIFFL.setColumns(10);
		
		JLabel lblWTCellH = new JLabel("W.TCell.H ");
		lblWTCellH.setBounds(707, 54, 55, 14);
		panel_Alarm.add(lblWTCellH);
		
		textWTCellH = new JTextField();
		textWTCellH.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWTCellH.setBounds(772, 50, 46, 20);
		panel_Alarm.add(textWTCellH);
		textWTCellH.setColumns(10);
		
		JLabel lblWTCellL = new JLabel("W.TCell.L");
		lblWTCellL.setBounds(708, 82, 46, 14);
		panel_Alarm.add(lblWTCellL);
		
		textWTCellL = new JTextField();
		textWTCellL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textWTCellL.setBounds(772, 78, 46, 20);
		panel_Alarm.add(textWTCellL);
		textWTCellL.setColumns(10);
		
		Panel panel_Other = new Panel();
		panel_Other.setBounds(827, 79, 167, 333);
		contentPane.add(panel_Other);
		panel_Other.setLayout(null);
		
		JLabel lblAddr = new JLabel("Addr");
		lblAddr.setBounds(10, 39, 46, 14);
		panel_Other.add(lblAddr);
		
		textAddr = new JTextField();
		textAddr.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textAddr.setBounds(72, 36, 52, 20);
		panel_Other.add(textAddr);
		textAddr.setColumns(10);
		
		JLabel lblCmd = new JLabel("Cmd");
		lblCmd.setBounds(10, 70, 46, 14);
		panel_Other.add(lblCmd);
		
		textCmd = new JTextField();
		textCmd.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCmd.setBounds(72, 67, 52, 20);
		panel_Other.add(textCmd);
		textCmd.setColumns(10);
		
		JLabel lblVer = new JLabel("Ver");
		lblVer.setBounds(10, 101, 46, 14);
		panel_Other.add(lblVer);
		
		textVer = new JTextField();
		textVer.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textVer.setBounds(72, 98, 52, 20);
		panel_Other.add(textVer);
		textVer.setColumns(10);
		
		JLabel lblLen = new JLabel("Len");
		lblLen.setBounds(10, 132, 46, 14);
		panel_Other.add(lblLen);
		
		textLen = new JTextField();
		textLen.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textLen.setBounds(72, 129, 52, 20);
		panel_Other.add(textLen);
		textLen.setColumns(10);
		
		JLabel lblAddr2 = new JLabel("Addr2");
		lblAddr2.setBounds(10, 163, 46, 14);
		panel_Other.add(lblAddr2);
		
		textAddr2 = new JTextField();
		textAddr2.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textAddr2.setBounds(72, 160, 52, 20);
		panel_Other.add(textAddr2);
		textAddr2.setColumns(10);
		
		JLabel lblCellNum = new JLabel("CellNum");
		lblCellNum.setBounds(10, 194, 46, 14);
		panel_Other.add(lblCellNum);
		
		textCellNum = new JTextField();
		textCellNum.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCellNum.setBounds(72, 191, 52, 20);
		panel_Other.add(textCellNum);
		textCellNum.setColumns(10);
		
		JLabel lblCSGLimit = new JLabel("CSGLimit");
		lblCSGLimit.setBounds(10, 226, 46, 14);
		panel_Other.add(lblCSGLimit);
		
		textCSGLimit = new JTextField();
		textCSGLimit.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCSGLimit.setBounds(72, 222, 52, 20);
		panel_Other.add(textCSGLimit);
		textCSGLimit.setColumns(10);
		
		JLabel lblEngDesing = new JLabel("EngDesing");
		lblEngDesing.setBounds(10, 256, 52, 14);
		panel_Other.add(lblEngDesing);
		
		textEngDesing = new JTextField();
		textEngDesing.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textEngDesing.setBounds(72, 253, 51, 20);
		panel_Other.add(textEngDesing);
		textEngDesing.setColumns(10);
		
		JLabel lblRsense = new JLabel("Rsense");
		lblRsense.setBounds(10, 286, 46, 14);
		panel_Other.add(lblRsense);
		
		textRsense = new JTextField();
		textRsense.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textRsense.setBounds(72, 284, 52, 20);
		panel_Other.add(textRsense);
		textRsense.setColumns(10);
		
		JLabel lblVref = new JLabel("Vref");
		lblVref.setBounds(10, 316, 46, 14);
		panel_Other.add(lblVref);
		
		textVref = new JTextField();
		textVref.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textVref.setBounds(72, 311, 52, 20);
		panel_Other.add(textVref);
		textVref.setColumns(10);
		
		Label lblOther = new Label("Other");
		lblOther.setBounds(57, 10, 61, 19);
		panel_Other.add(lblOther);
		
		Label label_2 = new Label("Ah");
		label_2.setBounds(129, 256, 19, 14);
		panel_Other.add(label_2);
		
		Label label_3 = new Label("mh");
		label_3.setBounds(129, 286, 19, 14);
		panel_Other.add(label_3);
		
		Label label_4 = new Label("mV");
		label_4.setBounds(129, 316, 19, 14);
		panel_Other.add(label_4);
		
		Panel panel_Balance = new Panel();
		panel_Balance.setBounds(641, 122, 180, 155);
		contentPane.add(panel_Balance);
		panel_Balance.setLayout(null);
		
		Label lblBalance = new Label("Balance");
		lblBalance.setBounds(54, 0, 61, 19);
		panel_Balance.add(lblBalance);
		
		JLabel lblBModel = new JLabel("B.Model");
		lblBModel.setBounds(10, 25, 46, 14);
		panel_Balance.add(lblBModel);
		
		JLabel lblTHDis = new JLabel("THDis");
		lblTHDis.setBounds(10, 50, 46, 14);
		panel_Balance.add(lblTHDis);
		
		textTHDis = new JTextField();
		textTHDis.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTHDis.setBounds(64, 47, 61, 20);
		panel_Balance.add(textTHDis);
		textTHDis.setColumns(10);
		
		JLabel lblTlDis = new JLabel("TlDis");
		lblTlDis.setBounds(10, 75, 46, 14);
		panel_Balance.add(lblTlDis);
		
		textTlDis = new JTextField();
		textTlDis.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTlDis.setBounds(64, 72, 61, 20);
		panel_Balance.add(textTlDis);
		textTlDis.setColumns(10);
		
		JLabel lblVstar = new JLabel("Vstar");
		lblVstar.setBounds(10, 100, 46, 14);
		panel_Balance.add(lblVstar);
		
		textVstar = new JTextField();
		textVstar.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textVstar.setBounds(64, 97, 61, 20);
		panel_Balance.add(textVstar);
		textVstar.setColumns(10);
		
		JLabel lblBVDiff = new JLabel("B.VDiff");
		lblBVDiff.setBounds(10, 125, 46, 14);
		panel_Balance.add(lblBVDiff);
		
		textBVDiff = new JTextField();
		textBVDiff.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textBVDiff.setBounds(64, 122, 61, 20);
		panel_Balance.add(textBVDiff);
		textBVDiff.setColumns(10);
		
		textBModel = new JComboBox();
		textBModel.setModel(new DefaultComboBoxModel(new String[] {"00", "01", "02"}));
		textBModel.setBounds(64, 22, 52, 20);
		panel_Balance.add(textBModel);
		
		Label label = new Label("mV");
		label.setBounds(131, 100, 19, 14);
		panel_Balance.add(label);
		
		Label label_1 = new Label("mV");
		label_1.setBounds(131, 125, 19, 14);
		panel_Balance.add(label_1);
		
		Panel panel_Temperature = new Panel();
		panel_Temperature.setBounds(10, 412, 558, 144);
		contentPane.add(panel_Temperature);
		panel_Temperature.setLayout(null);
		
		JLabel lblCTcellHPro = new JLabel("CTcellHPro");
		lblCTcellHPro.setBounds(60, 25, 54, 14);
		panel_Temperature.add(lblCTcellHPro);
		
		textCTcellHPro = new JTextField();
		textCTcellHPro.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCTcellHPro.setBounds(116, 22, 46, 20);
		panel_Temperature.add(textCTcellHPro);
		textCTcellHPro.setColumns(10);
		
		JLabel lblCTcellHRel = new JLabel("CTcellHRel");
		lblCTcellHRel.setBounds(60, 53, 54, 14);
		panel_Temperature.add(lblCTcellHRel);
		
		textCTcellHRel = new JTextField();
		textCTcellHRel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCTcellHRel.setBounds(116, 50, 46, 20);
		panel_Temperature.add(textCTcellHRel);
		textCTcellHRel.setColumns(10);
		
		JLabel lblCtcelllpro = new JLabel("CTcellLPro");
		lblCtcelllpro.setBounds(60, 80, 55, 14);
		panel_Temperature.add(lblCtcelllpro);
		
		textCTcellLPro = new JTextField();
		textCTcellLPro.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCTcellLPro.setBounds(116, 77, 46, 20);
		panel_Temperature.add(textCTcellLPro);
		textCTcellLPro.setColumns(10);
		
		JLabel lblCtcelllrel = new JLabel("CTcellLRel");
		lblCtcelllrel.setBounds(60, 111, 55, 14);
		panel_Temperature.add(lblCtcelllrel);
		
		textCtcelllrel = new JTextField();
		textCtcelllrel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCtcelllrel.setBounds(116, 108, 46, 20);
		panel_Temperature.add(textCtcelllrel);
		textCtcelllrel.setColumns(10);
		
		textDtcellghpro = new JTextField();
		textDtcellghpro.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textDtcellghpro.setBounds(241, 21, 54, 20);
		panel_Temperature.add(textDtcellghpro);
		textDtcellghpro.setColumns(10);
		
		textDtcellhrel = new JTextField();
		textDtcellhrel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textDtcellhrel.setBounds(241, 49, 54, 20);
		panel_Temperature.add(textDtcellhrel);
		textDtcellhrel.setColumns(10);
		
		JLabel lblDtcellhrel = new JLabel("DTcellHRel");
		lblDtcellhrel.setBounds(172, 50, 55, 14);
		panel_Temperature.add(lblDtcellhrel);
		
		JLabel lblDtcellghpro = new JLabel("DTcellGHPro");
		lblDtcellghpro.setBounds(172, 25, 67, 14);
		panel_Temperature.add(lblDtcellghpro);
		
		JLabel lblDTcellLRel = new JLabel("DTcellLRel");
		lblDTcellLRel.setBounds(172, 109, 55, 14);
		panel_Temperature.add(lblDTcellLRel);
		
		textDTcellLRel = new JTextField();
		textDTcellLRel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textDTcellLRel.setBounds(241, 107, 54, 20);
		panel_Temperature.add(textDTcellLRel);
		textDTcellLRel.setColumns(10);
		
		textDtcelllpro = new JTextField();
		textDtcelllpro.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textDtcelllpro.setBounds(241, 76, 54, 20);
		panel_Temperature.add(textDtcelllpro);
		textDtcelllpro.setColumns(10);
		
		JLabel lblDtcelllpro = new JLabel("DTcellLPro");
		lblDtcelllpro.setBounds(172, 78, 55, 14);
		panel_Temperature.add(lblDtcelllpro);
		
		JLabel lblTenvhpro = new JLabel("TenvHPro");
		lblTenvhpro.setBounds(306, 25, 55, 14);
		panel_Temperature.add(lblTenvhpro);
		
		textTenvhpro = new JTextField();
		textTenvhpro.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTenvhpro.setBounds(371, 21, 46, 20);
		panel_Temperature.add(textTenvhpro);
		textTenvhpro.setColumns(10);
		
		JLabel lblTenvhrel = new JLabel("TenvHRel");
		lblTenvhrel.setBounds(305, 53, 56, 14);
		panel_Temperature.add(lblTenvhrel);
		
		textTenvhrel = new JTextField();
		textTenvhrel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTenvhrel.setBounds(371, 49, 46, 20);
		panel_Temperature.add(textTenvhrel);
		textTenvhrel.setColumns(10);
		
		JLabel lblTenvlpro = new JLabel("TenvLPro");
		lblTenvlpro.setBounds(306, 80, 55, 14);
		panel_Temperature.add(lblTenvlpro);
		
		textTenvlpro = new JTextField();
		textTenvlpro.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTenvlpro.setBounds(371, 76, 46, 20);
		panel_Temperature.add(textTenvlpro);
		textTenvlpro.setColumns(10);
		
		JLabel lblTenvlrel = new JLabel("TenvLRel");
		lblTenvlrel.setBounds(306, 111, 55, 14);
		panel_Temperature.add(lblTenvlrel);
		
		textTenvlrel = new JTextField();
		textTenvlrel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTenvlrel.setBounds(371, 107, 46, 20);
		panel_Temperature.add(textTenvlrel);
		textTenvlrel.setColumns(10);
		
		JLabel lblTfethpro = new JLabel("TfetHPro");
		lblTfethpro.setBounds(429, 25, 54, 14);
		panel_Temperature.add(lblTfethpro);
		
		textTfethpro = new JTextField();
		textTfethpro.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTfethpro.setBounds(485, 21, 46, 20);
		panel_Temperature.add(textTfethpro);
		textTfethpro.setColumns(10);
		
		textTfethrel = new JTextField();
		textTfethrel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTfethrel.setBounds(484, 49, 46, 20);
		panel_Temperature.add(textTfethrel);
		textTfethrel.setColumns(10);
		
		JLabel lblTfethrel = new JLabel("TfetHRel");
		lblTfethrel.setBounds(427, 53, 56, 14);
		panel_Temperature.add(lblTfethrel);
		
		JLabel lblTfetlpro = new JLabel("TfetLPro");
		lblTfetlpro.setBounds(427, 80, 56, 14);
		panel_Temperature.add(lblTfetlpro);
		
		textTfetlpro = new JTextField();
		textTfetlpro.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTfetlpro.setBounds(485, 76, 46, 20);
		panel_Temperature.add(textTfetlpro);
		textTfetlpro.setColumns(10);
		
		JLabel lblTfetlrel = new JLabel("TfetLRel");
		lblTfetlrel.setBounds(427, 111, 56, 14);
		panel_Temperature.add(lblTfetlrel);
		
		textTfetlrel = new JTextField();
		textTfetlrel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textTfetlrel.setBounds(485, 107, 46, 20);
		panel_Temperature.add(textTfetlrel);
		textTfetlrel.setColumns(10);
		
		Label lblTemperature = new Label("Temperature");
		lblTemperature.setBounds(14, 0, 74, 19);
		panel_Temperature.add(lblTemperature);
		
		JLabel lblHPro = new JLabel("H-Pro");
		lblHPro.setBounds(14, 25, 36, 14);
		panel_Temperature.add(lblHPro);
		
		JLabel lblHrel = new JLabel("H-Rel");
		lblHrel.setBounds(14, 53, 36, 14);
		panel_Temperature.add(lblHrel);
		
		JLabel lblLpro = new JLabel("L-Pro");
		lblLpro.setBounds(14, 80, 36, 14);
		panel_Temperature.add(lblLpro);
		
		JLabel lblLrel = new JLabel("L-Rel");
		lblLrel.setBounds(14, 111, 36, 14);
		panel_Temperature.add(lblLrel);
		
		JPanel panel_Current = new JPanel();
		panel_Current.setBounds(10, 247, 628, 144);
		contentPane.add(panel_Current);
		panel_Current.setLayout(null);
		
		JLabel lblCurrent_1 = new JLabel("Current");
		lblCurrent_1.setBounds(10, 11, 37, 14);
		panel_Current.add(lblCurrent_1);
		
		JLabel lblNewLabel = new JLabel("Pro[A]");
		lblNewLabel.setBounds(10, 36, 37, 14);
		panel_Current.add(lblNewLabel);
		
		JLabel lblDelms = new JLabel("Dly[mS]");
		lblDelms.setBounds(10, 61, 37, 14);
		panel_Current.add(lblDelms);
		
		JLabel lblRels = new JLabel("Rel[S]");
		lblRels.setBounds(10, 89, 37, 14);
		panel_Current.add(lblRels);
		
		JLabel lblLook = new JLabel("Look");
		lblLook.setBounds(10, 112, 37, 14);
		panel_Current.add(lblLook);
		
		JLabel lblCcproval = new JLabel("CC.PRO.VAL");
		lblCcproval.setBounds(57, 36, 74, 14);
		panel_Current.add(lblCcproval);
		
		textCcproval = new JTextField();
		textCcproval.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCcproval.setBounds(134, 33, 46, 20);
		panel_Current.add(textCcproval);
		textCcproval.setColumns(10);
		
		JLabel lblCcpropdly = new JLabel("CC.PRO.PDLY");
		lblCcpropdly.setBounds(57, 61, 74, 14);
		panel_Current.add(lblCcpropdly);
		
		textCcpropdly = new JTextField();
		textCcpropdly.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCcpropdly.setBounds(134, 57, 46, 20);
		panel_Current.add(textCcpropdly);
		textCcpropdly.setColumns(10);
		
		JLabel lblCcprordly = new JLabel("CC.PRO.RDLY");
		lblCcprordly.setBounds(57, 89, 74, 14);
		panel_Current.add(lblCcprordly);
		
		textCcprordly = new JTextField();
		textCcprordly.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCcprordly.setBounds(134, 86, 46, 20);
		panel_Current.add(textCcprordly);
		textCcprordly.setColumns(10);
		
		JLabel lblccprolock = new JLabel("CC.PRO.LOCK");
		lblccprolock.setBounds(57, 112, 74, 14);
		panel_Current.add(lblccprolock);
		
		textccprolock = new JTextField();
		textccprolock.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textccprolock.setBounds(134, 112, 46, 20);
		panel_Current.add(textccprolock);
		textccprolock.setColumns(10);
		
		JLabel lblCdproval = new JLabel("CD1.PRO.VAL");
		lblCdproval.setBounds(190, 36, 74, 14);
		panel_Current.add(lblCdproval);
		
		textCdproval = new JTextField();
		textCdproval.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCdproval.setBounds(274, 33, 60, 20);
		panel_Current.add(textCdproval);
		textCdproval.setColumns(10);
		
		JLabel lblCdpropdly = new JLabel("CD1.PRO.PDLY");
		lblCdpropdly.setBounds(190, 61, 74, 14);
		panel_Current.add(lblCdpropdly);
		
		textCdpropdly = new JTextField();
		textCdpropdly.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCdpropdly.setBounds(274, 58, 60, 20);
		panel_Current.add(textCdpropdly);
		textCdpropdly.setColumns(10);
		
		JLabel lblCdprordly = new JLabel("CD1.PRO.RDLY");
		lblCdprordly.setBounds(190, 89, 86, 14);
		panel_Current.add(lblCdprordly);
		
		textCdprordly = new JTextField();
		textCdprordly.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCdprordly.setBounds(274, 86, 60, 20);
		panel_Current.add(textCdprordly);
		textCdprordly.setColumns(10);
		
		JLabel lblCdprolock = new JLabel("CD1.PRO.LOCK");
		lblCdprolock.setBounds(190, 112, 86, 14);
		panel_Current.add(lblCdprolock);
		
		textCdprolock = new JTextField();
		textCdprolock.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCdprolock.setBounds(274, 109, 60, 20);
		panel_Current.add(textCdprolock);
		textCdprolock.setColumns(10);
		
		JLabel lblCdproval_1 = new JLabel("CD2.PRO.VAL");
		lblCdproval_1.setBounds(344, 36, 67, 14);
		panel_Current.add(lblCdproval_1);
		
		textCdproval_1 = new JTextField();
		textCdproval_1.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCdproval_1.setBounds(421, 33, 60, 20);
		panel_Current.add(textCdproval_1);
		textCdproval_1.setColumns(10);
		
		JLabel lblCdpropdly_1 = new JLabel("CD2.PRO.PDLY");
		lblCdpropdly_1.setBounds(344, 61, 80, 14);
		panel_Current.add(lblCdpropdly_1);
		
		textCdpropdly_1 = new JTextField();
		textCdpropdly_1.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCdpropdly_1.setBounds(421, 58, 60, 20);
		panel_Current.add(textCdpropdly_1);
		textCdpropdly_1.setColumns(10);
		
		JLabel lblCdprordly_1 = new JLabel("CD2.PRO.RDLY");
		lblCdprordly_1.setBounds(344, 89, 80, 14);
		panel_Current.add(lblCdprordly_1);
		
		textCdprordly_1 = new JTextField();
		textCdprordly_1.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCdprordly_1.setBounds(421, 86, 60, 20);
		panel_Current.add(textCdprordly_1);
		textCdprordly_1.setColumns(10);
		
		JLabel lblCdprolock_1 = new JLabel("CD2.PRO.LOCK");
		lblCdprolock_1.setBounds(344, 112, 80, 14);
		panel_Current.add(lblCdprolock_1);
		
		textCdprolock_1 = new JTextField();
		textCdprolock_1.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textCdprolock_1.setBounds(421, 109, 60, 20);
		panel_Current.add(textCdprolock_1);
		textCdprolock_1.setColumns(10);
		
		JLabel lblShortval = new JLabel("SHORT.VAL");
		lblShortval.setBounds(491, 36, 60, 14);
		panel_Current.add(lblShortval);
		
		JLabel lblShortrdly = new JLabel("SHORT.RDLY");
		lblShortrdly.setBounds(491, 61, 67, 14);
		panel_Current.add(lblShortrdly);
		
		textShortrdly = new JTextField();
		textShortrdly.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textShortrdly.setBounds(561, 58, 52, 20);
		panel_Current.add(textShortrdly);
		textShortrdly.setColumns(10);
		
		JLabel lblShortlock = new JLabel("SHORT.LOCK");
		lblShortlock.setBounds(491, 112, 67, 14);
		panel_Current.add(lblShortlock);
		
		textShortlock = new JTextField();
		textShortlock.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textShortlock.setBounds(561, 109, 52, 20);
		panel_Current.add(textShortlock);
		textShortlock.setColumns(10);
		
		textShortRel = new JTextField();
		textShortRel.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textShortRel.setColumns(10);
		textShortRel.setBounds(561, 86, 52, 20);
		panel_Current.add(textShortRel);
		
		JLabel lblShortRel = new JLabel("SHORT.REL");
		lblShortRel.setBounds(491, 89, 67, 14);
		panel_Current.add(lblShortRel);
		
		comboBoxShortval = new JComboBox();
		comboBoxShortval.setModel(new DefaultComboBoxModel(new String[] {"0.1", "0.2", "0.3", "0.4"}));		
		comboBoxShortval.setBounds(561, 33, 52, 20);
		panel_Current.add(comboBoxShortval);
		
		JButton btnDataonline = new JButton("DataOnline");
		btnDataonline.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
			//	DataRS485.ONline1.setVisible(true);
				GUIVisible=false;
				DataRS485.WORKDAN=true;
				
			}
		});
		btnDataonline.setBounds(717, 519, 89, 23);
		contentPane.add(btnDataonline);
		
		JButton btnTest = new JButton("Test");
		btnTest.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
					GUI.DataR=DataRS485.example;
					DataRS485.Comparation();	
			}
		});
		btnTest.setBounds(717, 485, 89, 23);
		contentPane.add(btnTest);
		
		JButton btnUpgrade = new JButton("Upgrade");
		btnUpgrade.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				//Errors.Verificate();
			//	DataRS485.TakeDataFS();				
			}
		});
		btnUpgrade.setBounds(717, 455, 89, 23);
		contentPane.add(btnUpgrade);
		
		Button btnTakeDataFS = new Button("TakeDataFS();");
		btnTakeDataFS.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
			//	DataRS485.TakeDataFS();
			}
		});
		btnTakeDataFS.setBounds(721, 427, 69, 19);
		contentPane.add(btnTakeDataFS);
		
		Button button = new Button("C");
		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				
			}
		});
		button.setBounds(692, 333, 69, 19);
		contentPane.add(button);
		
		panel_Battery = new Panel();
		panel_Battery.setBounds(287, 124, 296, 117);
		contentPane.add(panel_Battery);
		panel_Battery.setLayout(null);
		
		Label label_6 = new Label("(V)");
		label_6.setBounds(248, 84, 28, 19);
		panel_Battery.add(label_6);
		
		textBUVPREL = new JTextField();
		textBUVPREL.setBounds(196, 83, 46, 20);
		panel_Battery.add(textBUVPREL);
		textBUVPREL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textBUVPREL.setColumns(10);
		
		Label label_7 = new Label("(mS)");
		label_7.setBounds(248, 59, 28, 19);
		panel_Battery.add(label_7);
		
		textBUVPDLY = new JTextField();
		textBUVPDLY.setBounds(196, 59, 46, 20);
		panel_Battery.add(textBUVPDLY);
		textBUVPDLY.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textBUVPDLY.setColumns(10);
		
		Label label_5 = new Label("(V)");
		label_5.setBounds(248, 35, 28, 19);
		panel_Battery.add(label_5);
		
		textBUVPVAL = new JTextField();
		textBUVPVAL.setBounds(196, 35, 46, 20);
		panel_Battery.add(textBUVPVAL);
		textBUVPVAL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textBUVPVAL.setColumns(10);
		
		lblBUVPREL = new Label("BUVPREL");
		lblBUVPREL.setBounds(133, 83, 53, 19);
		panel_Battery.add(lblBUVPREL);
		
		textBOVPREL = new JTextField();
		textBOVPREL.setBounds(66, 83, 61, 20);
		panel_Battery.add(textBOVPREL);
		textBOVPREL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textBOVPREL.setColumns(10);
		
		lblBOVPREL = new JLabel("BOVPREL");
		lblBOVPREL.setBounds(10, 87, 46, 14);
		panel_Battery.add(lblBOVPREL);
		
		lblBOVPDLY = new JLabel("BOVPDLY");
		lblBOVPDLY.setBounds(10, 63, 46, 14);
		panel_Battery.add(lblBOVPDLY);
		
		lblBOVPVAL = new JLabel("BOVPVAL");
		lblBOVPVAL.setBounds(10, 39, 46, 14);
		panel_Battery.add(lblBOVPVAL);
		
		textBOVPVAL = new JTextField();
		textBOVPVAL.setBounds(66, 35, 61, 20);
		panel_Battery.add(textBOVPVAL);
		textBOVPVAL.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textBOVPVAL.setColumns(10);
		
		textBOVPDLY = new JTextField();
		textBOVPDLY.setBounds(66, 59, 61, 20);
		panel_Battery.add(textBOVPDLY);
		textBOVPDLY.setFont(new Font("Tahoma", Font.PLAIN, 13));
		textBOVPDLY.setColumns(10);
		
		lblBUVPDLY = new JLabel("BUVPDLY");
		lblBUVPDLY.setBounds(140, 63, 46, 14);
		panel_Battery.add(lblBUVPDLY);
		
		lblBUVPVAL = new JLabel("BUVPVAL");
		lblBUVPVAL.setBounds(140, 39, 46, 14);
		panel_Battery.add(lblBUVPVAL);
		
		lblVolBattery = new Label("Battery");
		lblVolBattery.setBounds(115, 10, 61, 19);
		panel_Battery.add(lblVolBattery);
		
// New timer2 which works!//////READ from SERIAL PORT
	    int delay2 =400; //milliseconds
	      ActionListener taskPerformer2 = new ActionListener() {
	          public void actionPerformed(ActionEvent evt) {
	        	  
	              try {
					if(SerialPORTS.input.available()>0){  
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
// New timer3 which works!//////READ from SERIAL PORT
		    int delay3 =1000; //milliseconds
		      ActionListener taskPerformer3 = new ActionListener() {
		          public void actionPerformed(ActionEvent evt) {
//		        	  SerialPORTS.writeData(":000264000EFE~");    	                
		          }				
		      };
		      new Timer(delay3, taskPerformer3).start();			
	//////**************************************--------------//////////				
	     	
		
	}

	
}
