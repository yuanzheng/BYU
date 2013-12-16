

1. Factory Method Pattern
   Factory Method pattern lets a class developer define the interface for creating an object while retaining 
   control of which class to instantiate.
   * Defines an interface for creating objects, but let subclasses to decide which class to instantiate
   * Refers to the newly created object through a common interface

   The participants classes in this pattern are:
   "Animal" defines the interface for objects the factory method creates.
   "Cat & Dog" class implements the "Animal" interface.
   "AnimalFactory" (also refered as Factory because it creates the "Animal" objects) declares the method 
   FactoryMethod, which returns a "Animal" object. May call the generating method for creating "Animal" objects
   "DogFactory & CatFactory" overrides the generating method for creating "AnimalFactory" objects
   All concrete products are subclasses of the "Animal" class, so all of them have the same basic implementation, 
   The "AnimalFactory" class specifies all standard and generic behavior of the ¡°Animals" and when a new "Animal" 
   is needed, it sends the creation details that are supplied by the client to the "Car or Dog" factory.