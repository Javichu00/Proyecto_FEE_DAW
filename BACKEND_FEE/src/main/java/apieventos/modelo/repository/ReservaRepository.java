package apieventos.modelo.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import apieventos.modelo.entities.Reserva;

public interface ReservaRepository extends CrudRepository<Reserva, Integer> {
    List<Reserva> findByUsuario_IdUsuario(Integer idUsuario);
    List<Reserva> findByEvento_IdEvento(Integer idEvento);
}