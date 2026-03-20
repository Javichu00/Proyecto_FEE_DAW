package apieventos.modelo.services;

import java.util.List;

public interface GenericService<E,ID> {
	
	E insertOne(E entity);
	E updateOne(E entity);
	int deleteOne(ID atributoPk);
	E findOne(ID atributoPk);
	List<E> findAll();

}
