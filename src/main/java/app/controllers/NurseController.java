package app.controllers;

import app.entities.DTOs.Nurse.NurseDTO;
import app.entities.Nurse;
import app.mapper.NurseMapper;
import app.repositories.NurseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/nurse")
public class NurseController {
    private final NurseRepository nurseRepository;
    private final NurseMapper nurseMapper;

    @GetMapping("/get-all-nurses")
    public List<NurseDTO> index() {
        return nurseMapper.NursesToNurseDTOs(nurseRepository.findAll());
    }

    @PostMapping("/add-nurse")
    public String Add(NurseDTO nurseDTO) {
        if (nurseRepository.findByPhone(nurseDTO.phone).size() != 0)
            return ResponseEntity.badRequest().body(" phone must be different ").toString();
        if (nurseDTO.name != "" && nurseDTO.phone != "") {
            nurseRepository.save(nurseMapper.NurseDTOToNurse(nurseDTO));
            return ResponseEntity.ok(nurseDTO).toString();
        }
        return ResponseEntity.badRequest().body(" incorrect nurse value : " + nurseDTO).toString();
    }

    @DeleteMapping("/delete-nurse")
    public String Delete(int NurseId) {
        if (nurseRepository.existsById(NurseId)) {
            nurseRepository.deleteById(NurseId);
            return "Successfully deleted";
        } else return ResponseEntity.badRequest().body(" nurse doesn`t exist").toString();
    }

    @PutMapping("/edit-nurse")
    public String Edit(int NurseId, NurseDTO nurseDTO) {
        Nurse nurse = nurseRepository.getById(NurseId);
        String error_message = "";
        if (nurseDTO.name != "" && nurse.getName() != nurseDTO.name)
            nurse.setName(nurseDTO.name);
        if (nurseRepository.findByPhone(nurseDTO.phone).toArray().length == 0) {
            if (nurseDTO.phone != "" && nurse.getPhone() != nurseDTO.phone)
                nurse.setPhone(nurseDTO.phone);
        } else error_message += " but phone number wasn`t changed because nurse with it exist";
        nurseRepository.save(nurse);
        return "Successfully edited" + error_message;
    }
}