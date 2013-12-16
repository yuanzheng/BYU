package FactoryMethod;

/*
 * Author SongYz
 * 
 * 工厂方法模式（Factory Method）  将程序中创建对象的操作，
 * 单独出来处理，创建一个产品的工厂接口，把实际的工作转移到
 * 具体的子类。大大提高了系统扩展的柔性，接口的抽象化处理给
 * 相互依赖的对象创建提供了最好的抽象模式。
 * 
 * Factory Method pattern lets a class developer define the interface for creating
 * an object while retaining control of which class to instantiate.
 */

public class TestFactoryMethod {

	public static void main(String[] args) {

		AnimalFactory af=new DogFactory();

		af.runFactoryMethod();

	}

}

