package apieventos.modelo.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import apieventos.modelo.entities.Reserva;
import apieventos.modelo.repository.ReservaRepository;

@Service
public class ReservaServiceImplDataJpaMy8 implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public Reserva insertOne(Reserva entity) {
        try {
            return reservaRepository.save(entity);
        } catch (Exception e) {
            System.err.println("Error al insertar reserva: " + e.getMessage());
            return null;
        }
    }

    @Override
    public Reserva updateOne(Reserva entity) {
        try {
            if (reservaRepository.existsById(entity.getIdReserva()))
                return reservaRepository.save(entity);
            return null;
        } catch (Exception e) {
            System.err.println("Error al actualizar reserva: " + e.getMessage());
            return null;
        }
    }

    @Override
    public int deleteOne(Integer idReserva) {
        try {
            if (reservaRepository.existsById(idReserva)) {
                reservaRepository.deleteById(idReserva);
                return 1;
            }
            return 0;
        } catch (Exception e) {
            System.err.println("Error al eliminar reserva: " + e.getMessage());
            return -1;
        }
    }

    @Override
    public Reserva findOne(Integer idReserva) {
        try {
            return reservaRepository.findById(idReserva).orElse(null);
        } catch (Exception e) {
            System.err.println("Error al buscar reserva: " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<Reserva> findAll() {
        try {
            return (List<Reserva>) reservaRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error al listar reservas: " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<Reserva> findByUsuario(Integer idUsuario) {
        try {
            return reservaRepository.findByUsuario_IdUsuario(idUsuario);
        } catch (Exception e) {
            System.err.println("Error al buscar reservas por usuario: " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<Reserva> findByEvento(Integer idEvento) {
        try {
            return reservaRepository.findByEvento_IdEvento(idEvento);
        } catch (Exception e) {
            System.err.println("Error al buscar reservas por evento: " + e.getMessage());
            return null;
        }
    }

    @Override
    public int aforoOcupado(Integer idEvento) {
        try {
            List<Reserva> reservas = reservaRepository.findByEvento_IdEvento(idEvento);
            return reservas.stream().mapToInt(Reserva::getCantidad).sum();
        } catch (Exception e) {
            System.err.println("Error al calcular aforo: " + e.getMessage());
            return 0;
        }
    }
}