package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.ClientDTO;
import com.whitecape.ecoplateform.entity.*;
import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.mapper.ClientMapper;
import com.whitecape.ecoplateform.repository.ClientRepository;
import com.whitecape.ecoplateform.repository.UserRepository;
import com.whitecape.ecoplateform.service.Authentication.TokenService;
import com.whitecape.ecoplateform.validator.ClientValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor
public class ClientService {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final BadgeService badgeService;
    private final ChallengeService challengeService;
    private final ClassementService classementService;
    private final RecompenseService recompenseService;
    private final TokenService tokenService;

    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(ClientMapper::toDTO)
                .toList();
    }
    public List<ClientDTO> getClientsByCity(String city) {
        return clientRepository.findByCity(city)
                .stream()
                .map(ClientMapper::toDTO)
                .toList();
    }
    @Transactional
    public Client addClient(Client client) {
        if(userRepository.existsByMail(client.getMail())) {
            throw new InvalidOperationException(
                    "L'adreese mail existe déjà.",
                    ErrorCodes.ADRESSE_MAIL_ALREADY_EXISTS);
        }
        Client savedClient = clientRepository.save(client);
        classementService.addClassementsForNewClient(savedClient);
        badgeService.createClientGamificationForNewClient(savedClient);
        challengeService.createClientGamificationForNewClient(savedClient);
        recompenseService.subscribeRecompenses(client);
        return savedClient;

    }

    @Transactional
    public void updateClient(ClientDTO updatedClientDTO) {
        ClientValidator.validateUpdating(updatedClientDTO);

        Client updatedClient =ClientMapper.toEntity(updatedClientDTO);
        Client existingClient=clientRepository.findById(updatedClient.getId()).orElseThrow(() ->
                new EntityNotFoundException("Aucun client trouvé avec l'identifiant : " + updatedClient.getId()+".", ErrorCodes.CLIENT_NOT_FOUND)
        );
        if((updatedClient.getDisplayName() !=null && !Objects.equals(existingClient.getDisplayName(), updatedClient.getDisplayName())) && !Objects.equals(updatedClient.getDisplayName(), "")){
            existingClient.setDisplayName(updatedClient.getDisplayName());
            System.out.println(updatedClient.getDisplayName());
        }
        if (updatedClient.getCity()!=null && !Objects.equals(existingClient.getCity(), updatedClient.getCity()) && !Objects.equals(updatedClient.getCity(), "")) {
            existingClient.setCity(updatedClient.getCity().toUpperCase());
        }
        clientRepository.save(existingClient);
        classementService.updateClassementByCity(existingClient);

    }
    @Transactional
    public void deleteClient(Long id){
        Client client=clientRepository.findById(id).orElseThrow(() ->
                        new EntityNotFoundException("Aucun utilisateur trouvé avec l'identifiant : " + id+".", ErrorCodes.CLIENT_NOT_FOUND));
        tokenService.deleTokenByClient(client.getId());
        clientRepository.delete(client);
    }
    public ClientDTO getClient(Long id) {
        return clientRepository.findById(id)
                .map(ClientMapper::toDTO)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Aucun utilisateur trouvé avec l'identifiant : " + id + ".",
                                ErrorCodes.CLIENT_NOT_FOUND
                        )
                );
    }
}
