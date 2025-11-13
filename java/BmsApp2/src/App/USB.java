package App;

import javax.swing.JFrame;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.SwingConstants;
import javax.swing.JComboBox;
import java.awt.event.ActionListener;
import java.awt.Color;
import java.awt.event.ActionEvent;
import javax.swing.DefaultComboBoxModel;
import java.awt.Font;
import java.awt.Image;
import java.awt.Toolkit;

public class USB {
	
	private JFrame frame;	
	private JLabel lblNewLabel;
	
	public static void main(String[] args) {
		
		USB window = new USB();
		//window.frame.setVisible(true);
		
	}

	public USB() {
		initialize();
		frame.setVisible(true);
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes", "rawtypes", "rawtypes" })
	private void initialize() {
		
		frame = new JFrame();
		frame.setUndecorated(false);
		frame.getContentPane().setBackground(Color.WHITE);
		frame.setBounds(30, 30, 400, 280);
		frame.setResizable(false);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setIconImage(Toolkit.getDefaultToolkit().getImage(USB.class.getResource("/LOGO.PNG")));
		
		SerialPORTS.SerialPORTS();
	
		lblNewLabel = new JLabel("New label");
		 lblNewLabel.setIcon(new ImageIcon(USB.class.getResource("/dan-tech.JPG")));
		 lblNewLabel.setBounds(61, 11, 253, 79);
		 frame.getContentPane().add(lblNewLabel);
		
		JLabel lblHello = new JLabel("please select port:");
		lblHello.setBounds(73, 70, 229, 69);
		lblHello.setForeground(new Color(0, 102, 51));
		lblHello.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		lblHello.setHorizontalAlignment(SwingConstants.CENTER);		
			
		@SuppressWarnings("rawtypes")
		final JComboBox comboBoxUSB = new JComboBox();
		comboBoxUSB.setBounds(101, 127, 173, 28);
		comboBoxUSB.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		comboBoxUSB.setForeground(new Color(0, 102, 51));
		comboBoxUSB.setVisible(true);
		comboBoxUSB.setMaximumRowCount(2);
		comboBoxUSB.setModel(new DefaultComboBoxModel(SerialPORTS.port));
		
		
		JButton btnConnect = new JButton("Connect");
		btnConnect.setBounds(125, 176, 123, 41);
		btnConnect.setBackground(new Color(0, 102, 51));
		btnConnect.setFont(new Font("Yu Gothic UI", Font.PLAIN, 18));
		btnConnect.setForeground(new Color(255, 255, 255));
		btnConnect.setVisible(true);
		btnConnect.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				
				SerialPORTS.PortToUse = comboBoxUSB.getSelectedItem().toString();
				System.out.println("Port USB Selected: " + SerialPORTS.PortToUse);
				SerialPORTS.SerialOpen();
				frame.setVisible(false);
				Menupanel nw = new Menupanel();
				nw.Menupanel();
				
				
			}});
		frame.getContentPane().setLayout(null);
		frame.getContentPane().setLayout(null);
		frame.getContentPane().add(comboBoxUSB);
		frame.getContentPane().add(btnConnect);
		frame.getContentPane().add(lblHello);
		

	
		
	}
}
