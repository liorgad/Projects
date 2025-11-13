package App;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;

import javax.swing.DefaultComboBoxModel;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JTextPane;
import javax.swing.JProgressBar;
import javax.swing.SwingConstants;
import java.awt.SystemColor;
import java.awt.Toolkit;



@SuppressWarnings("unused")
public class Viewpanel {
	
	public static JProgressBar progressBarVbat, progressBar_1, progressBar_2, progressBar_3, progressBar_4, progressBar_5, progressBar_6, progressBar_7, progressBar_8, progressBar_9, progressBar_10, progressBar_11, progressBar_12, progressBar_13, progressBar_14, progressBar_15, progressBar_16;
	public static JTextPane textPane_1, textPane_2, textPane_3, textPane_4, textPane_5, textPane_6, textPane_7, textPane_8, textPane_9, textPane_10, textPane_11, textPane_12, textPane_13, textPane_14, textPane_15, textPane_16
							,txtpnV, txtpnV_1, txtpnV_2, txtpnC_0, txtpnC_1, txtpnC_2, txtpnC_3, txtpnC_4, txtpnSerials, txtpnA, txtpnA_1, textPane_Batv
							,txtpnS_0, txtpnS_1, txtpnS_2, txtpnS_3, txtpnS_4, txtpnS_5, txtpnS_6, txtpnS_7, txtpnS_8, txtpnS_9, txtpnS_10, txtpnS_11, txtpnS_12, txtpnS_13, txtpnS_14, txtpnS_15;
	
	

	private JFrame frame;
	private JLabel lblNewLabel;

	/**
	 * Launch the application.
	 */
	public void Viewpanel() {
		
		DataRS485.burn=false;
		Menupanel.run1=false;
		
		
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Viewpanel window = new Viewpanel();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public Viewpanel() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		
		
		
		frame = new JFrame();
		frame.setUndecorated(false);
		frame.getContentPane().setBackground(Color.WHITE);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		frame.setBounds(30, 30, 1100,420);
		frame.setResizable(false);
		
		JButton Closebt = new JButton("Close");
		
		JTextPane txtpnCells = new JTextPane();
		txtpnCells.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnCells.setText("Cells:");
		txtpnCells.setBounds(786, 21, 90, 50);
		frame.getContentPane().add(txtpnCells);
		
		JTextPane txtpnChCurrent = new JTextPane();
		txtpnChCurrent.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnChCurrent.setText("CH current:");
		txtpnChCurrent.setBounds(786, 122, 121, 50);
		frame.getContentPane().add(txtpnChCurrent);
		txtpnCells.setEditable(false);
		
		JTextPane txtpnDcCurrent = new JTextPane();
		txtpnDcCurrent.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnDcCurrent.setText("DC current:");
		txtpnDcCurrent.setBounds(786, 72, 121, 50);
		frame.getContentPane().add(txtpnDcCurrent);
		txtpnDcCurrent.setEditable(false);
		
		JTextPane txtpnVoltage = new JTextPane();
		txtpnVoltage.setText("Bat Voltage:");
		txtpnVoltage.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnVoltage.setBounds(17, 103, 138, 50);
		frame.getContentPane().add(txtpnVoltage);
		txtpnVoltage.setEditable(false);
		
		JTextPane txtpnT = new JTextPane();
		txtpnT.setText("T1:");
		txtpnT.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnT.setBounds(623, 172, 50, 39);
		frame.getContentPane().add(txtpnT);
		txtpnT.setEditable(false);
		
		JTextPane txtpnT_1 = new JTextPane();
		txtpnT_1.setText("T2:");
		txtpnT_1.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnT_1.setBounds(731, 172, 50, 39);
		frame.getContentPane().add(txtpnT_1);
		txtpnT_1.setEditable(false);
		
		JTextPane txtpnT_2 = new JTextPane();
		txtpnT_2.setText("T3:");
		txtpnT_2.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnT_2.setBounds(838, 172, 50, 39);
		frame.getContentPane().add(txtpnT_2);
		txtpnT_2.setEditable(false);
		
		JTextPane txtpnT_3 = new JTextPane();
		txtpnT_3.setText("T4:");
		txtpnT_3.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnT_3.setBounds(938, 172, 50, 39);
		frame.getContentPane().add(txtpnT_3);
		txtpnT_3.setEditable(false);
		
		JTextPane txtpnT_4 = new JTextPane();
		txtpnT_4.setText("T0:");
		txtpnT_4.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnT_4.setBounds(518, 172, 50, 39);
		frame.getContentPane().add(txtpnT_4);
		txtpnT_4.setEditable(false);
		
		JTextPane txtpnVmax = new JTextPane();
		txtpnVmax.setText("Vmax:");
		txtpnVmax.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnVmax.setBounds(10, 172, 65, 39);
		frame.getContentPane().add(txtpnVmax);
		txtpnVmax.setEditable(false);
		
		JTextPane txtpnVmin = new JTextPane();
		txtpnVmin.setText("Vmin:");
		txtpnVmin.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnVmin.setBounds(172, 172, 62, 39);
		frame.getContentPane().add(txtpnVmin);
		txtpnVmin.setEditable(false);
		
		JTextPane txtpnVdiff = new JTextPane();
		txtpnVdiff.setText("Vdiff:");
		txtpnVdiff.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnVdiff.setBounds(340, 172, 56, 39);
		frame.getContentPane().add(txtpnVdiff);
		txtpnVdiff.setEditable(false);
		
		progressBarVbat = new JProgressBar();
		progressBarVbat.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		progressBarVbat.setToolTipText("");
		progressBarVbat.setValue(0);
		progressBarVbat.setForeground(new Color(0, 102, 51));
		progressBarVbat.setBackground(new Color(240, 240, 240));
		progressBarVbat.setBounds(467, 21, 293, 132);
		frame.getContentPane().add(progressBarVbat);
		progressBarVbat.setStringPainted(true);
		
		progressBar_1 = new JProgressBar();
		progressBar_1.setMaximum(4250);
		progressBar_1.setMinimum(2500);
		progressBar_1.setValue(0);
		progressBar_1.setBackground(new Color(255, 255, 255));
		progressBar_1.setForeground(new Color(0, 102, 51));
		progressBar_1.setOrientation(SwingConstants.VERTICAL);
		progressBar_1.setBounds(17, 242, 36, 108);
		frame.getContentPane().add(progressBar_1);
		progressBar_1.setVisible(false);
		
		progressBar_2 = new JProgressBar();
		progressBar_2.setMaximum(4250);
		progressBar_2.setMinimum(2500);
		progressBar_2.setValue(0);
		progressBar_2.setOrientation(SwingConstants.VERTICAL);
		progressBar_2.setForeground(new Color(0, 102, 51));
		progressBar_2.setBackground(Color.WHITE);
		progressBar_2.setBounds(77, 242, 36, 108);
		frame.getContentPane().add(progressBar_2);
		progressBar_2.setVisible(false);
		
	progressBar_3 = new JProgressBar();
		progressBar_3.setMaximum(4250);
		progressBar_3.setMinimum(2500);
		progressBar_3.setValue(0);
		progressBar_3.setOrientation(SwingConstants.VERTICAL);
		progressBar_3.setForeground(new Color(0, 102, 51));
		progressBar_3.setBackground(Color.WHITE);
		progressBar_3.setBounds(137, 242, 36, 108);
		frame.getContentPane().add(progressBar_3);
		progressBar_3.setVisible(false);
		
	progressBar_4 = new JProgressBar();
		progressBar_4.setMaximum(4250);
		progressBar_4.setMinimum(2500);
		progressBar_4.setValue(0);
		progressBar_4.setOrientation(SwingConstants.VERTICAL);
		progressBar_4.setForeground(new Color(0, 102, 51));
		progressBar_4.setBackground(Color.WHITE);
		progressBar_4.setBounds(197, 242, 36, 108);
		frame.getContentPane().add(progressBar_4);
		progressBar_4.setVisible(false);
		
	progressBar_5 = new JProgressBar();
		progressBar_5.setMaximum(4250);
		progressBar_5.setMinimum(2500);
		progressBar_5.setValue(0);
		progressBar_5.setOrientation(SwingConstants.VERTICAL);
		progressBar_5.setForeground(new Color(0, 102, 51));
		progressBar_5.setBackground(Color.WHITE);
		progressBar_5.setBounds(257, 242, 36, 108);
		frame.getContentPane().add(progressBar_5);
		progressBar_5.setVisible(false);
		
	progressBar_6 = new JProgressBar();
		progressBar_6.setMaximum(4250);
		progressBar_6.setMinimum(2500);
		progressBar_6.setValue(0);
		progressBar_6.setOrientation(SwingConstants.VERTICAL);
		progressBar_6.setForeground(new Color(0, 102, 51));
		progressBar_6.setBackground(Color.WHITE);
		progressBar_6.setBounds(317, 242, 36, 108);
		frame.getContentPane().add(progressBar_6);
		progressBar_6.setVisible(false);
		
	progressBar_7 = new JProgressBar();
		progressBar_7.setMaximum(4250);
		progressBar_7.setMinimum(2500);
		progressBar_7.setValue(0);
		progressBar_7.setOrientation(SwingConstants.VERTICAL);
		progressBar_7.setForeground(new Color(0, 102, 51));
		progressBar_7.setBackground(Color.WHITE);
		progressBar_7.setBounds(377, 242, 36, 108);
		frame.getContentPane().add(progressBar_7);
		progressBar_7.setVisible(false);
		
	progressBar_8 = new JProgressBar();
		progressBar_8.setMaximum(4250);
		progressBar_8.setMinimum(2500);
		progressBar_8.setValue(0);
		progressBar_8.setOrientation(SwingConstants.VERTICAL);
		progressBar_8.setForeground(new Color(0, 102, 51));
		progressBar_8.setBackground(Color.WHITE);
		progressBar_8.setBounds(437, 242, 36, 108);
		frame.getContentPane().add(progressBar_8);
		progressBar_8.setVisible(false);
		
	progressBar_9 = new JProgressBar();
		progressBar_9.setMaximum(4250);
		progressBar_9.setMinimum(2500);
		progressBar_9.setValue(0);
		progressBar_9.setOrientation(SwingConstants.VERTICAL);
		progressBar_9.setForeground(new Color(0, 102, 51));
		progressBar_9.setBackground(Color.WHITE);
		progressBar_9.setBounds(497, 242, 36, 108);
		frame.getContentPane().add(progressBar_9);
		progressBar_9.setVisible(false);
		
	 progressBar_10 = new JProgressBar();
		progressBar_10.setMaximum(4250);
		progressBar_10.setMinimum(2500);
		progressBar_10.setValue(0);
		progressBar_10.setOrientation(SwingConstants.VERTICAL);
		progressBar_10.setForeground(new Color(0, 102, 51));
		progressBar_10.setBackground(Color.WHITE);
		progressBar_10.setBounds(557, 242, 36, 108);
		frame.getContentPane().add(progressBar_10);
		progressBar_10.setVisible(false);
		
	progressBar_11 = new JProgressBar();
		progressBar_11.setMaximum(4250);
		progressBar_11.setMinimum(2500);
		progressBar_11.setValue(0);
		progressBar_11.setOrientation(SwingConstants.VERTICAL);
		progressBar_11.setForeground(new Color(0, 102, 51));
		progressBar_11.setBackground(Color.WHITE);
		progressBar_11.setBounds(617, 242, 36, 108);
		frame.getContentPane().add(progressBar_11);
		progressBar_11.setVisible(false);
		
	 progressBar_12 = new JProgressBar();
		progressBar_12.setMaximum(4250);
		progressBar_12.setMinimum(2500);
		progressBar_12.setValue(0);
		progressBar_12.setOrientation(SwingConstants.VERTICAL);
		progressBar_12.setForeground(new Color(0, 102, 51));
		progressBar_12.setBackground(Color.WHITE);
		progressBar_12.setBounds(677, 242, 36, 108);
		frame.getContentPane().add(progressBar_12);
		progressBar_12.setVisible(false);
		
	 progressBar_13 = new JProgressBar();
		progressBar_13.setMaximum(4250);
		progressBar_13.setMinimum(2500);
		progressBar_13.setValue(0);
		progressBar_13.setOrientation(SwingConstants.VERTICAL);
		progressBar_13.setForeground(new Color(0, 102, 51));
		progressBar_13.setBackground(Color.WHITE);
		progressBar_13.setBounds(737, 242, 36, 108);
		frame.getContentPane().add(progressBar_13);
		progressBar_13.setVisible(false);
		
	 progressBar_14 = new JProgressBar();
		progressBar_14.setMaximum(4250);
		progressBar_14.setMinimum(2500);
		progressBar_14.setValue(0);
		progressBar_14.setOrientation(SwingConstants.VERTICAL);
		progressBar_14.setForeground(new Color(0, 102, 51));
		progressBar_14.setBackground(Color.WHITE);
		progressBar_14.setBounds(797, 242, 36, 108);
		frame.getContentPane().add(progressBar_14);
		progressBar_14.setVisible(false);
		
 progressBar_15 = new JProgressBar();
		progressBar_15.setMaximum(4250);
		progressBar_15.setMinimum(2500);
		progressBar_15.setValue(0);
		progressBar_15.setOrientation(SwingConstants.VERTICAL);
		progressBar_15.setForeground(new Color(0, 102, 51));
		progressBar_15.setBackground(Color.WHITE);
		progressBar_15.setBounds(857, 242, 36, 108);
		frame.getContentPane().add(progressBar_15);
		progressBar_15.setVisible(false);
		
	 progressBar_16 = new JProgressBar();
		progressBar_16.setMaximum(4250);
		progressBar_16.setMinimum(2500);
		progressBar_16.setValue(0);
		progressBar_16.setOrientation(SwingConstants.VERTICAL);
		progressBar_16.setForeground(new Color(0, 102, 51));
		progressBar_16.setBackground(Color.WHITE);
		progressBar_16.setBounds(917, 242, 36, 108);
		frame.getContentPane().add(progressBar_16);
		progressBar_16.setVisible(false);
		
	txtpnS_0 = new JTextPane();
		txtpnS_0.setText("S1");
		txtpnS_0.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_0.setBounds(17, 352, 36, 39);
		frame.getContentPane().add(txtpnS_0);
		txtpnS_0.setVisible(false);
		
	 txtpnS_1 = new JTextPane();
		txtpnS_1.setText("S2");
		txtpnS_1.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_1.setBounds(79, 352, 36, 39);
		frame.getContentPane().add(txtpnS_1);
		txtpnS_1.setVisible(false);
		
	 txtpnS_2 = new JTextPane();
		txtpnS_2.setText("S3");
		txtpnS_2.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_2.setBounds(136, 352, 36, 39);
		frame.getContentPane().add(txtpnS_2);
		txtpnS_2.setVisible(false);
		
	 txtpnS_3 = new JTextPane();
		txtpnS_3.setText("S4");
		txtpnS_3.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_3.setBounds(195, 352, 36, 39);
		frame.getContentPane().add(txtpnS_3);
		txtpnS_3.setVisible(false);
		
	 txtpnS_4 = new JTextPane();
		txtpnS_4.setText("S5");
		txtpnS_4.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_4.setBounds(257, 352, 36, 39);
		frame.getContentPane().add(txtpnS_4);
		txtpnS_4.setVisible(false);
		
	 txtpnS_5 = new JTextPane();
		txtpnS_5.setText("S6");
		txtpnS_5.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_5.setBounds(317, 352, 36, 39);
		frame.getContentPane().add(txtpnS_5);
		txtpnS_5.setVisible(false);
		
	 txtpnS_6 = new JTextPane();
		txtpnS_6.setText("S7");
		txtpnS_6.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_6.setBounds(377, 352, 36, 39);
		frame.getContentPane().add(txtpnS_6);
		txtpnS_6.setVisible(false);
		
	 txtpnS_7 = new JTextPane();
		txtpnS_7.setText("S8");
		txtpnS_7.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_7.setBounds(437, 352, 36, 39);
		frame.getContentPane().add(txtpnS_7);
		txtpnS_7.setVisible(false);
		
	 txtpnS_8 = new JTextPane();
		txtpnS_8.setText("S9");
		txtpnS_8.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_8.setBounds(497, 352, 36, 39);
		frame.getContentPane().add(txtpnS_8);
		txtpnS_8.setVisible(false);
		
	txtpnS_9 = new JTextPane();
		txtpnS_9.setText("S10");
		txtpnS_9.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_9.setBounds(558, 352, 36, 39);
		frame.getContentPane().add(txtpnS_9);
		txtpnS_9.setVisible(false);
		
	 txtpnS_10 = new JTextPane();
		txtpnS_10.setText("S11");
		txtpnS_10.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_10.setBounds(617, 352, 36, 39);
		frame.getContentPane().add(txtpnS_10);
		txtpnS_10.setVisible(false);
		
	txtpnS_11 = new JTextPane();
		txtpnS_11.setText("S12");
		txtpnS_11.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_11.setBounds(677, 352, 36, 39);
		frame.getContentPane().add(txtpnS_11);
		txtpnS_11.setVisible(false);
		
	 txtpnS_12 = new JTextPane();
		txtpnS_12.setText("S13");
		txtpnS_12.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_12.setBounds(737, 352, 36, 39);
		frame.getContentPane().add(txtpnS_12);
		txtpnS_12.setVisible(false);
		
	txtpnS_13 = new JTextPane();
		txtpnS_13.setText("S14");
		txtpnS_13.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_13.setBounds(797, 352, 36, 39);
		frame.getContentPane().add(txtpnS_13);
		txtpnS_13.setVisible(false);
		
	 txtpnS_14 = new JTextPane();
		txtpnS_14.setText("S15");
		txtpnS_14.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_14.setBounds(857, 352, 36, 39);
		frame.getContentPane().add(txtpnS_14);
		txtpnS_14.setVisible(false);
		
	txtpnS_15 = new JTextPane();
		txtpnS_15.setText("S16");
		txtpnS_15.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnS_15.setBounds(917, 352, 36, 39);
		frame.getContentPane().add(txtpnS_15);
		txtpnS_15.setVisible(false);
		
	 textPane_2 = new JTextPane();
		textPane_2.setForeground(new Color(0, 102, 0));
		textPane_2.setText("v");
		textPane_2.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_2.setBounds(79, 212, 48, 45);
		frame.getContentPane().add(textPane_2);
		textPane_2.setVisible(false);
		
	 textPane_3 = new JTextPane();
		textPane_3.setForeground(new Color(0, 102, 0));
		textPane_3.setText("v");
		textPane_3.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_3.setBounds(138, 212, 48, 45);
		frame.getContentPane().add(textPane_3);
		textPane_3.setVisible(false);
		
	 textPane_4 = new JTextPane();
		textPane_4.setForeground(new Color(0, 102, 0));
		textPane_4.setText("v");
		textPane_4.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_4.setBounds(195, 212, 48, 45);
		frame.getContentPane().add(textPane_4);
		textPane_4.setVisible(false);
		
	 textPane_5 = new JTextPane();
		textPane_5.setForeground(new Color(0, 102, 0));
		textPane_5.setText("v");
		textPane_5.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_5.setBounds(257, 212, 48, 45);
		frame.getContentPane().add(textPane_5);
		textPane_5.setVisible(false);
		
	 textPane_6 = new JTextPane();
		textPane_6.setForeground(new Color(0, 102, 0));
		textPane_6.setText("v");
		textPane_6.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_6.setBounds(317, 212, 48, 45);
		frame.getContentPane().add(textPane_6);
		textPane_6.setVisible(false);
		
	textPane_7 = new JTextPane();
		textPane_7.setForeground(new Color(0, 102, 0));
		textPane_7.setText("v");
		textPane_7.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_7.setBounds(377, 212, 48, 45);
		frame.getContentPane().add(textPane_7);
		textPane_7.setVisible(false);
		
	 textPane_8 = new JTextPane();
		textPane_8.setForeground(new Color(0, 102, 0));
		textPane_8.setText("v");
		textPane_8.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_8.setBounds(437, 212, 48, 45);
		frame.getContentPane().add(textPane_8);
		textPane_8.setVisible(false);
		
	 textPane_9 = new JTextPane();
		textPane_9.setForeground(new Color(0, 102, 0));
		textPane_9.setText("v");
		textPane_9.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_9.setBounds(497, 212, 48, 45);
		frame.getContentPane().add(textPane_9);
		textPane_9.setVisible(false);
		
	 textPane_10 = new JTextPane();
		textPane_10.setForeground(new Color(0, 102, 0));
		textPane_10.setText("v");
		textPane_10.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_10.setBounds(558, 212, 48, 45);
		frame.getContentPane().add(textPane_10);
		textPane_10.setVisible(false);
		
	 textPane_11 = new JTextPane();
		textPane_11.setForeground(new Color(0, 102, 0));
		textPane_11.setText("v");
		textPane_11.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_11.setBounds(619, 212, 48, 45);
		frame.getContentPane().add(textPane_11);
		textPane_11.setVisible(false);
		
	 textPane_12 = new JTextPane();
		textPane_12.setForeground(new Color(0, 102, 0));
		textPane_12.setText("v");
		textPane_12.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_12.setBounds(677, 212, 48, 45);
		frame.getContentPane().add(textPane_12);
		textPane_12.setVisible(false);
		
	textPane_13 = new JTextPane();
		textPane_13.setForeground(new Color(0, 102, 0));
		textPane_13.setText("v");
		textPane_13.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_13.setBounds(738, 212, 48, 45);
		frame.getContentPane().add(textPane_13);
		textPane_13.setVisible(false);
		
	 textPane_14 = new JTextPane();
		textPane_14.setForeground(new Color(0, 102, 0));
		textPane_14.setText("v");
		textPane_14.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_14.setBounds(797, 212, 48, 45);
		frame.getContentPane().add(textPane_14);
		textPane_14.setVisible(false);
		
 textPane_15 = new JTextPane();
		textPane_15.setForeground(new Color(0, 102, 0));
		textPane_15.setText("v");
		textPane_15.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_15.setBounds(857, 212, 48, 45);
		frame.getContentPane().add(textPane_15);
		textPane_15.setVisible(false);
		
	 textPane_16 = new JTextPane();
		textPane_16.setForeground(new Color(0, 102, 0));
		textPane_16.setText("v");
		textPane_16.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
		textPane_16.setBounds(917, 212, 62, 45);
		frame.getContentPane().add(textPane_16);
		textPane_16.setVisible(false);
		
	 txtpnV = new JTextPane();
		txtpnV.setForeground(new Color(0, 102, 0));
		txtpnV.setText("V");
		txtpnV.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnV.setBounds(85, 172, 83, 39);
		frame.getContentPane().add(txtpnV);
		
		
 txtpnV_1 = new JTextPane();
		txtpnV_1.setForeground(new Color(0, 102, 0));
		txtpnV_1.setText("V");
		txtpnV_1.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnV_1.setBounds(247, 172, 88, 39);
		frame.getContentPane().add(txtpnV_1);
		
	 txtpnV_2 = new JTextPane();
		txtpnV_2.setForeground(new Color(0, 102, 0));
		txtpnV_2.setText("V");
		txtpnV_2.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnV_2.setBounds(415, 172, 105, 39);
		frame.getContentPane().add(txtpnV_2);
		
	txtpnC_0 = new JTextPane();
		txtpnC_0.setForeground(new Color(0, 102, 0));
		txtpnC_0.setText("c");
		txtpnC_0.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnC_0.setBounds(571, 172, 50, 39);
		frame.getContentPane().add(txtpnC_0);
		
	 txtpnC_1 = new JTextPane();
		txtpnC_1.setForeground(new Color(0, 102, 0));
		txtpnC_1.setText("c");
		txtpnC_1.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnC_1.setBounds(676, 172, 50, 39);
		frame.getContentPane().add(txtpnC_1);
		
	 txtpnC_2 = new JTextPane();
		txtpnC_2.setForeground(new Color(0, 102, 0));
		txtpnC_2.setText("c");
		txtpnC_2.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnC_2.setBounds(784, 172, 50, 39);
		frame.getContentPane().add(txtpnC_2);
		
	 txtpnC_3 = new JTextPane();
		txtpnC_3.setForeground(new Color(0, 102, 0));
		txtpnC_3.setText("c");
		txtpnC_3.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnC_3.setBounds(891, 172, 50, 39);
		frame.getContentPane().add(txtpnC_3);
		
	 txtpnC_4 = new JTextPane();
		txtpnC_4.setForeground(new Color(0, 102, 0));
		txtpnC_4.setText("c");
		txtpnC_4.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnC_4.setBounds(992, 172, 62, 39);
		frame.getContentPane().add(txtpnC_4);
		
	 txtpnSerials = new JTextPane();
		txtpnSerials.setForeground(new Color(0, 102, 0));
		txtpnSerials.setText("s");
		txtpnSerials.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnSerials.setBounds(906, 22, 90, 50);
		frame.getContentPane().add(txtpnSerials);
		
	 txtpnA = new JTextPane();
		txtpnA.setForeground(new Color(0, 102, 0));
		txtpnA.setText("A");
		txtpnA.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnA.setBounds(906, 73, 121, 50);
		frame.getContentPane().add(txtpnA);
		
	 txtpnA_1 = new JTextPane();
		txtpnA_1.setForeground(new Color(0, 102, 0));
		txtpnA_1.setText("A");
		txtpnA_1.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		txtpnA_1.setBounds(906, 123, 121, 50);
		frame.getContentPane().add(txtpnA_1);
		
	textPane_Batv = new JTextPane();
		textPane_Batv.setText("V");
		textPane_Batv.setForeground(new Color(0, 102, 0));
		textPane_Batv.setFont(new Font("Yu Gothic UI Semibold", Font.PLAIN, 28));
		textPane_Batv.setBounds(197, 103, 216, 56);
		frame.getContentPane().add(textPane_Batv);
		
	 textPane_1 = new JTextPane();
	 textPane_1.setForeground(new Color(0, 102, 0));
	 textPane_1.setText("v");
	 textPane_1.setFont(new Font("Yu Gothic UI", Font.PLAIN, 15));
	 textPane_1.setBounds(17, 212, 48, 45);
	 frame.getContentPane().add(textPane_1);
	 
	 lblNewLabel = new JLabel("New label");
	 lblNewLabel.setIcon(new ImageIcon("C:\\Users\\samsung\\Desktop\\work\\projects\\BmsApp2\\img\\dan-tech.JPG"));
	 lblNewLabel.setBounds(52, 0, 253, 79);
	 frame.getContentPane().add(lblNewLabel);
		
	}
}
