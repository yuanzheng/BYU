package AbstractFactory;

/*
 * Author Lucas SongYz
 * 
 * 针对多个产品等级的情况，而工厂方法模式针对单一产品等级的情况
 */
import java.awt.*;
import java.awt.event.*;

public class TestAbstractFactory {
	
	public static void main(String[] args) {

		GUIFactory fact=new SwingFactory();
		Frame f=fact.getFrame();
		Component c1=fact.getButton();
		Component c2=fact.getTextField();


		f.setSize(500,300);
		f.setLayout(new FlowLayout());
		f.add(c1);
		f.add(c2);
		f.setVisible(true);


		f.addWindowListener(new WindowAdapter(){

			public void windowClosing(WindowEvent e){
				System.exit(0);

			}

			}
		);
	}
} 