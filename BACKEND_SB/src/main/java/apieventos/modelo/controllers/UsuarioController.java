package apieventos.modelo.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import apieventos.modelo.dto.LoginDTO;
import apieventos.modelo.entities.Perfil;
import apieventos.modelo.entities.Usuario;
import apieventos.modelo.repository.PerfilRepository;
import apieventos.modelo.services.UsuarioService;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PerfilRepository perfilRepository;

    // GET /usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> getAll() {
        List<Usuario> lista = usuarioService.findAll();
        if (lista == null || lista.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(lista);
    }

    // POST /usuarios/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        Optional<Usuario> encontrado = usuarioService.findByEmail(dto.getEmail());
        if (encontrado.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email no encontrado");
        
        Usuario usuario = encontrado.get();
        
        if (!usuario.getPassword().equals(dto.getPassword()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        
        if (usuario.getEnabled() != 1)
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cuenta desactivada");
        
        return ResponseEntity.ok(usuario);
    }

    // POST /usuarios/registro
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        if (usuarioService.findByEmail(usuario.getEmail()).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El email ya está registrado");

        if (usuario.getPerfil() == null || usuario.getPerfil().getIdPerfil() == null) {
            Perfil perfilCliente = perfilRepository.findById(2).orElse(null);
            if (perfilCliente == null)
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Perfil cliente no encontrado");
            usuario.setPerfil(perfilCliente);
        }

        usuario.setEnabled(1);
        usuario.setFechaRegistro(LocalDate.now());

        Usuario nuevo = usuarioService.insertOne(usuario);
        if (nuevo == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al crear el usuario");
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // PUT /usuarios
    @PutMapping
    public ResponseEntity<?> update(@RequestBody Usuario usuario) {
        Usuario actualizado = usuarioService.updateOne(usuario);
        if (actualizado == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Usuario usuario = usuarioService.findOne(id);
        if (usuario == null)
            return ResponseEntity.notFound().build();
        usuario.setEnabled(0);
        usuarioService.updateOne(usuario);
        return ResponseEntity.ok().build();
    }
    
}