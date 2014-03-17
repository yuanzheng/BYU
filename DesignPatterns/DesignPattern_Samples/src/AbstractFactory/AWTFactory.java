package AbstractFactory;

import java.awt.Button;
import java.awt.Component;
import java.awt.Frame;
import java.awt.TextField;

public class AWTFactory extends GUIFactory {

	public Component getButton() {

		return new Button("AWT Button");

	}

	public Frame getFrame() {

		return new Frame("AWT Frame");

	}

	public Component getTextField() {

		return new TextField(20);

	}

}
