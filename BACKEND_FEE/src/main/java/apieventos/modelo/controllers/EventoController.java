package apieventos.modelo.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import apieventos.modelo.dto.EventoFiltroDTO;
import apieventos.modelo.entities.Evento;
import apieventos.modelo.services.EventoService;

@RestController
@RequestMapping("/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // GET /eventos 
    @GetMapping
    public ResponseEntity<List<Evento>> getAll() {
        List<Evento> lista = eventoService.findAll();
        if (lista.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(lista);
    }

    // GET /eventos/1 
    @GetMapping("/{id}")
    public ResponseEntity<Evento> getOne(@PathVariable Integer id) {
        Evento evento = eventoService.findOne(id);
        if (evento == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(evento);
    }

    // POST /eventos/filtrar 
    @PostMapping("/filtrar")
    public ResponseEntity<List<Evento>> filtrar(@RequestBody EventoFiltroDTO filtro) {
        List<Evento> lista = eventoService.findAll();

        if (filtro.getIdTipo() != null)
            lista = lista.stream()
                .filter(e -> e.getTipo().getIdTipo().equals(filtro.getIdTipo()))
                .toList();

        if (filtro.getNombre() != null && !filtro.getNombre().isBlank())
            lista = lista.stream()
                .filter(e -> e.getNombre().toLowerCase()
                    .contains(filtro.getNombre().toLowerCase()))
                .toList();

        if (filtro.getCategorias() != null && !filtro.getCategorias().isEmpty())
            lista = lista.stream()
                .filter(e -> filtro.getCategorias().contains(e.getCategoria()))
                .toList();

        if (filtro.getExtremidades() != null && !filtro.getExtremidades().isEmpty())
            lista = lista.stream()
                .filter(e -> filtro.getExtremidades().contains(e.getExtremidad()))
                .toList();

        if (filtro.getPrecioMin() != null)
            lista = lista.stream()
                .filter(e -> e.getPrecio() >= filtro.getPrecioMin())
                .toList();

        if (filtro.getPrecioMax() != null)
            lista = lista.stream()
                .filter(e -> e.getPrecio() <= filtro.getPrecioMax())
                .toList();

        if (filtro.getFechaMin() != null)
            lista = lista.stream()
                .filter(e -> e.getFechaInicio() != null &&
                    !e.getFechaInicio().isBefore(filtro.getFechaMin()))
                .toList();

        if (filtro.getFechaMax() != null)
            lista = lista.stream()
                .filter(e -> e.getFechaFin() != null &&
                    !e.getFechaFin().isAfter(filtro.getFechaMax()))
                .toList();

        if (filtro.getAforoMinimo() != null)
            lista = lista.stream()
                .filter(e -> e.getAforoMaximo() >= filtro.getAforoMinimo())
                .toList();

        if (lista.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(lista);
    }

    // POST /eventos 
    @PostMapping
    public ResponseEntity<Evento> create(@RequestBody Evento evento) {
        Evento nuevo = eventoService.insertOne(evento);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // PUT /eventos 
    @PutMapping
    public ResponseEntity<Evento> update(@RequestBody Evento evento) {
        Evento actualizado = eventoService.updateOne(evento);
        if (actualizado == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizado);
    }

    // DELETE /eventos/1 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        int resultado = eventoService.deleteOne(id);
        if (resultado == 1)
            return ResponseEntity.ok().build();
        else if (resultado == 0)
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.internalServerError().build();
    }
}