package FactoryMethod;

public class CatFactory extends AnimalFactory {

	// Factory Method
	protected Animal getAnimal(){

		System.out.println("Cat");

		return new Cat();

	}
}
