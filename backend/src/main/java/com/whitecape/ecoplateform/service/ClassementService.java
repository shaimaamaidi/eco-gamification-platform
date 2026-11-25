package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.ClientDTO;
import com.whitecape.ecoplateform.entity.Action;
import com.whitecape.ecoplateform.entity.Classement;
import com.whitecape.ecoplateform.entity.Client;
import com.whitecape.ecoplateform.entity.User;
import com.whitecape.ecoplateform.enums.ActionStatus;
import com.whitecape.ecoplateform.enums.ActionType;
import com.whitecape.ecoplateform.enums.ClassementType;
import com.whitecape.ecoplateform.mapper.ClientMapper;
import com.whitecape.ecoplateform.repository.ActionRepository;
import com.whitecape.ecoplateform.repository.ClassementRepository;
import com.whitecape.ecoplateform.repository.ClientRepository;
import com.whitecape.ecoplateform.service.Notification.ClientNotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassementService {
    private final ClassementRepository classementRepository;
    private final ClientRepository clientRepository;
    private final ActionRepository actionRepository;
    private final ClientNotificationService clientNotificationService;

    @Transactional
    public void addClassementsForNewClient(Client client){
        List<Client> clientsByCity=clientRepository.findByCity(client.getCity());
        Classement classementByCity=new Classement();
        classementByCity.setTotalPoints(0);
        classementByCity.setPosition(clientsByCity.size());
        classementByCity.setType(ClassementType.BY_CITY);
        classementByCity.setClient(client);
        classementByCity.setCity(client.getCity());
        classementRepository.save(classementByCity);

        List<Client> clientsGlobal=clientRepository.findAll();
        Classement classementGlobale=new Classement();
        classementGlobale.setTotalPoints(0);
        classementGlobale.setPosition(clientsGlobal.size());
        classementGlobale.setType(ClassementType.GLOBAL);
        classementGlobale.setClient(client);
        classementRepository.save(classementGlobale);

        for (ActionType type : ActionType.values()) {
            Classement classement = createClassementActionForNewClient(type, client);
            classementRepository.save(classement);
        }
    }
    @Transactional
    private Classement createClassementActionForNewClient(ActionType type,Client client){
        List<Action>actions=actionRepository.findByTypeAndStatus(type, ActionStatus.ACCEPTED);
        Classement classement=new Classement();
        classement.setActionType(type);
        classement.setTotalPoints(0);
        classement.setPosition(actions.size()+1);
        classement.setType(ClassementType.BY_ACTION);
        classement.setClient(client);
        return classement;
    }
    @Transactional
    public void updateClassementsClient(Client client,int actionPoints,ActionType type){
        //classement globale
        Classement classementGlobal=classementRepository.findByClientIdAndType(client.getId(), ClassementType.GLOBAL).orElseThrow(() ->
                new RuntimeException("Erreur interne : Veuillez contacter l'administrateur."));
        classementGlobal.setTotalPoints(client.getTotalPoints());
        classementRepository.save(classementGlobal);

        List<Classement> classementsGlobal=classementRepository.findByType(ClassementType.GLOBAL);
        int oldPositionGlobal = classementGlobal.getPosition();
        this.sortClassements(classementsGlobal);

        if (oldPositionGlobal>classementGlobal.getPosition()) {
            clientNotificationService.notifyClient(
                    client,
                    String.format("Félicitations ! Votre position dans le classement GLOBAL a progressé : nouvelle position %d !", classementGlobal.getPosition())
            );
        }

        //classement par ville
        Classement classementByCity=classementRepository.findByClientIdAndType(client.getId(),ClassementType.BY_CITY).orElseThrow(() ->
                new RuntimeException("Erreur interne : Veuillez contacter l'administrateur."));
        classementByCity.setTotalPoints(client.getTotalPoints());
        classementRepository.save(classementByCity);

        List<Classement> classementsByCity=classementRepository.findByTypeAndCity(ClassementType.BY_CITY,client.getCity());
        int oldPositionByCity = classementGlobal.getPosition();
        this.sortClassements(classementsByCity);

        if (oldPositionByCity>classementByCity.getPosition()) {
            clientNotificationService.notifyClient(
                    client,
                    String.format("Félicitations ! Votre position dans le classement PAR VILLE a progressé : nouvelle position %d !", classementByCity.getPosition())
            );
        }

        if(type!=null) {
            //classement by action
            Classement classementByAction = classementRepository.findByClientIdAndTypeAndActionType(client.getId(), ClassementType.BY_ACTION, type).orElseThrow(() ->
                    new RuntimeException("Erreur interne : Veuillez contacter l'administrateur."));
            classementByAction.setTotalPoints(classementByAction.getTotalPoints() + actionPoints);
            classementRepository.save(classementByAction);

            List<Classement> classementsByAction = classementRepository.findByTypeAndActionType(ClassementType.BY_ACTION, type);
            int oldPositionByAction = classementGlobal.getPosition();
            this.sortClassements(classementsByAction);

            if (oldPositionByAction > classementByAction.getPosition()) {
                clientNotificationService.notifyClient(
                        client,
                        String.format("Félicitations ! Votre position dans le classement PAR ACTION a progressé : nouvelle position %d !", classementByAction.getPosition())
                );
            }
        }

    }
    @Transactional
    public void updateClassementByCity(Client client){
        //classement par ville
        Classement classementByCity=classementRepository.findByClientIdAndType(client.getId(),ClassementType.BY_CITY).orElseThrow(() ->
                new RuntimeException("Erreur interne : Veuillez contacter l'administrateur."));
        classementByCity.setCity(client.getCity());
        classementRepository.save(classementByCity);

        List<Classement> classementsByCity=classementRepository.findByTypeAndCity(ClassementType.BY_CITY,client.getCity());
        this.sortClassements(classementsByCity);
    }
    @Transactional
    private void sortClassements(List<Classement> classements){
        classements.sort((c1, c2) -> Integer.compare(c2.getTotalPoints(), c1.getTotalPoints()));
        for (int i = 0; i < classements.size(); i++) {
            classements.get(i).setPosition(i + 1);
        }
        classementRepository.saveAll(classements);
    }
    //for admin and client
    public List<ClientDTO> getClientsWithClassements(){
        return clientRepository.findAll()
                .stream()
                .filter(User::isEnabled)
                .map(ClientMapper::toDTO)
                .toList();
    }
}
