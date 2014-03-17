package AbstractFactory;

import java.awt.Component;
import java.awt.Frame;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JTextField;

public class SwingFactory extends GUIFactory {

	public Component getButton() {

		return new JButton("Swing Button");

	}

	public Frame getFrame() {

		return new JFrame("Swing Frame");

	}

	public Component getTextField() {

		return new JTextField(20);

	}
}
