package apieventos.modelo.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import apieventos.modelo.entities.Evento;
import apieventos.modelo.enums.CategoriaEvento;
import apieventos.modelo.enums.Extremidad;

public interface EventoRepository extends CrudRepository<Evento, Integer>{
    List<Evento> findByNombreContaining(String subcadena);
    List<Evento> findByTipo_IdTipo(Integer idTipo);
    List<Evento> findByCategoria(CategoriaEvento categoria);
    List<Evento> findByExtremidad(Extremidad extremidad);
    List<Evento> findByPrecioBetween(Double min, Double max);
}