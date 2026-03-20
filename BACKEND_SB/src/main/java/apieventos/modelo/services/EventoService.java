package apieventos.modelo.services;

import java.util.List;
import apieventos.modelo.entities.Evento;
import apieventos.modelo.enums.CategoriaEvento;
import apieventos.modelo.enums.Extremidad;

public interface EventoService extends GenericService<Evento, Integer> {

    List<Evento> buscarPorNombre(String subcadena);
    List<Evento> buscarPorTipo(Integer idTipo);
    List<Evento> buscarPorCategoria(CategoriaEvento categoria);
    List<Evento> buscarPorExtremidad(Extremidad extremidad);
    List<Evento> buscarPorRangoPrecios(Double min, Double max);
}