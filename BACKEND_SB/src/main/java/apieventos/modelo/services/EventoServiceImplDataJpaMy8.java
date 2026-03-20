package apieventos.modelo.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import apieventos.modelo.entities.Evento;
import apieventos.modelo.enums.CategoriaEvento;
import apieventos.modelo.enums.Extremidad;
import apieventos.modelo.repository.EventoRepository;

@Service
public class EventoServiceImplDataJpaMy8 implements EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Override
    public Evento insertOne(Evento entity) {
        return eventoRepository.save(entity);
    }

    @Override
    public Evento updateOne(Evento entity) {
        if (eventoRepository.existsById(entity.getIdEvento())) {
            return eventoRepository.save(entity);
        }
        return null;
    }

    @Override
    public int deleteOne(Integer atributoPk) {
        try {
            if (eventoRepository.existsById(atributoPk)) {
                eventoRepository.deleteById(atributoPk);
                return 1;
            }
            return 0;
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return -1;
        }
    }

    @Override
    public Evento findOne(Integer atributoPk) {
        return eventoRepository.findById(atributoPk).orElse(null);
    }

    @Override
    public List<Evento> findAll() {
        return (List<Evento>) eventoRepository.findAll();
    }

    @Override
    public List<Evento> buscarPorNombre(String subcadena) {
        return eventoRepository.findByNombreContaining(subcadena);
    }

    @Override
    public List<Evento> buscarPorTipo(Integer idTipo) {
        return eventoRepository.findByTipo_IdTipo(idTipo);
    }

    @Override
    public List<Evento> buscarPorCategoria(CategoriaEvento categoria) {
        return eventoRepository.findByCategoria(categoria);
    }

    @Override
    public List<Evento> buscarPorExtremidad(Extremidad extremidad) {
        return eventoRepository.findByExtremidad(extremidad);
    }

    @Override
    public List<Evento> buscarPorRangoPrecios(Double min, Double max) {
        return eventoRepository.findByPrecioBetween(min, max);
    }
}