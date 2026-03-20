package apieventos.modelo.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import apieventos.modelo.entities.Reserva;
import apieventos.modelo.services.ReservaService;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    // GET /reservas
    @GetMapping
    public ResponseEntity<List<Reserva>> getAll() {
        List<Reserva> lista = reservaService.findAll();
        if (lista == null || lista.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(lista);
    }

    // GET /reservas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getOne(@PathVariable Integer id) {
        Reserva reserva = reservaService.findOne(id);
        if (reserva == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(reserva);
    }

    // POST /reservas
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Reserva reserva) {
        if (reserva.getCantidad() == null || reserva.getCantidad() < 1 || reserva.getCantidad() > 10)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("La cantidad debe estar entre 1 y 10");
        Reserva nueva = reservaService.insertOne(reserva);
        if (nueva == null)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Ya tienes una reserva para este evento");
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    // PUT /reservas
    @PutMapping
    public ResponseEntity<?> update(@RequestBody Reserva reserva) {
        if (reserva.getCantidad() == null || reserva.getCantidad() < 1 || reserva.getCantidad() > 10)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("La cantidad debe estar entre 1 y 10");
        Reserva actualizada = reservaService.updateOne(reserva);
        if (actualizada == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizada);
    }

    // DELETE /reservas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        int resultado = reservaService.deleteOne(id);
        if (resultado == 1)  return ResponseEntity.ok().build();
        if (resultado == 0)  return ResponseEntity.notFound().build();
        return ResponseEntity.internalServerError().build();
    }

    // GET /reservas/evento/{idEvento}/aforo
    @GetMapping("/evento/{idEvento}/aforo")
    public ResponseEntity<?> aforoOcupado(@PathVariable Integer idEvento) {
        int ocupado = reservaService.aforoOcupado(idEvento);
        return ResponseEntity.ok(ocupado);
    }
}