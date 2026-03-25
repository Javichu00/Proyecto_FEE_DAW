package apieventos.modelo.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import apieventos.modelo.dto.EventoFiltroDTO;
import apieventos.modelo.entities.Evento;
import apieventos.modelo.entities.Tipo;
import apieventos.modelo.enums.CategoriaEvento;
import apieventos.modelo.enums.EstadoEvento;
import apieventos.modelo.enums.Extremidad;
import apieventos.modelo.services.EventoService;
import apieventos.modelo.services.ImgBBService;

@RestController
@RequestMapping("/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private ImgBBService imgBBService;

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

    // POST /eventos/crearEvento (Usa una foto)
    @PostMapping(value = "/crearEvento", consumes = "multipart/form-data")
    public ResponseEntity<Evento> crearEvento(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin,
            @RequestParam String localizacion,
            @RequestParam Integer aforoMaximo,
            @RequestParam Double precio,
            @RequestParam Integer idTipo,
            @RequestParam String estado,
            @RequestParam String categoria,
            @RequestParam String extremidad,
            @RequestParam MultipartFile foto) {
        try {
            String rutaFoto = imgBBService.subirImagen(foto);

            Evento evento = new Evento();
            evento.setNombre(nombre);
            evento.setDescripcion(descripcion);
            evento.setFechaInicio(LocalDate.parse(fechaInicio));
            evento.setFechaFin(LocalDate.parse(fechaFin));
            evento.setLocalizacion(localizacion);
            evento.setAforoMaximo(aforoMaximo);
            evento.setPrecio(precio);
            evento.setEstado(EstadoEvento.valueOf(estado));
            evento.setCategoria(CategoriaEvento.valueOf(categoria));
            evento.setExtremidad(Extremidad.valueOf(extremidad));
            evento.setFechaAlta(LocalDate.now());
            evento.setRutaFoto(rutaFoto);

            Tipo tipo = new Tipo();
            tipo.setIdTipo(idTipo);
            evento.setTipo(tipo);

            Evento nuevo = eventoService.insertOne(evento);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
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