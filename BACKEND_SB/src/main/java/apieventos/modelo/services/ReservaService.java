package apieventos.modelo.services;

import java.util.List;
import apieventos.modelo.entities.Reserva;

public interface ReservaService extends GenericService<Reserva, Integer> {
    List<Reserva> findByUsuario(Integer idUsuario);
    List<Reserva> findByEvento(Integer idEvento);
    int aforoOcupado(Integer idEvento);
}