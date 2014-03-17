package AbstractFactory;

import java.awt.Component;
import java.awt.Frame;

abstract class GUIFactory {

	public abstract Component getButton();

	public abstract Component getTextField();

	public abstract Frame getFrame();
}
