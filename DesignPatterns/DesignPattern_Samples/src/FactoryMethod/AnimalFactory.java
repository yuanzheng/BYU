package FactoryMethod;

public abstract class AnimalFactory {

	public void runFactoryMethod() {
		Animal product =  getAnimal();
	}
	
	// Factory method
	protected abstract Animal getAnimal();
}
