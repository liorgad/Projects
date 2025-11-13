package App;

import java.awt.Color;
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

@SuppressWarnings("unused")
public class Menupanel {

	public static boolean run1;
	private JFrame frame;

	/**
	 * Launch the application.
	 */
	public void Menupanel() {
		
		DataRS485.burn=false;
		run1=false;
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Menupanel window = new Menupanel();
					window.frame.setVisible(false);
					Viewpanel nw = new Viewpanel();
					nw.Viewpanel();
					DataRS485.InsM = 7;
					if(run1==false) {
						DAN_TECH_Online.main(null);
						DataRS485.WORKDAN=true;
						run1=true;
						}
						else
							DataRS485.TakeData=false;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public Menupanel() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
	
		frame = new JFrame();
		//frame.setExtendedState(JFrame.MAXIMIZED_BOTH); 
		frame.setUndecorated(true);
		frame.getContentPane().setBackground(Color.WHITE);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		frame.setBounds(0, 0, 800, 480);
		
		JTextPane title1 = new JTextPane();
		title1.setEditable(false);
		title1.setForeground(new Color(0, 102, 51));
		title1.setFont(new Font("Tahoma", Font.BOLD, 45));
		title1.setText("Smart BMS Workstation");
		title1.setBounds(119, 21, 655, 102);
		frame.getContentPane().add(title1);
		
		
		JButton Closebt = new JButton("Close");
		Closebt = new JButton("Exit");
		Closebt.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				System.exit(0);
			}
		});
		Closebt.setFont(new Font("Tahoma", Font.BOLD, 40));
		Closebt.setForeground(new Color(255, 255, 255));
		Closebt.setBackground(new Color(153, 0, 0));
		Closebt.setBounds(534, 274, 229, 129);
		frame.getContentPane().add(Closebt);
		Closebt.setVisible(true);
		
		
		JButton btnConnect2 = new JButton("Viewer");
		btnConnect2.setBounds(534, 134, 229, 129);
		btnConnect2.setBackground(new Color(0, 153, 153));
		btnConnect2.setFont(new Font("Tahoma", Font.PLAIN, 32));
		btnConnect2.setForeground(new Color(255, 255, 255));
		btnConnect2.setVisible(true);
		btnConnect2.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				
				Viewpanel nw = new Viewpanel();
				nw.Viewpanel();
				DataRS485.InsM = 7;
				if(run1==false) {
					DAN_TECH_Online.main(null);
					DataRS485.WORKDAN=true;
					run1=true;
					}
					else
						DataRS485.TakeData=false;
				
			}});
		frame.getContentPane().add(btnConnect2);
	
		
	}
}
