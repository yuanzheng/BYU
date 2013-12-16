package FactoryMethod;

public class DogFactory extends AnimalFactory {

	// factory Method
	protected Animal getAnimal(){

		System.out.println("Dog");

		return new Dog();

	}
}
