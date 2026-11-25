package com.whitecape.ecoplateform.mapper;

import com.whitecape.ecoplateform.dto.ClientDTO;
import com.whitecape.ecoplateform.entity.Classement;
import com.whitecape.ecoplateform.entity.Client;

public class ClientMapper {
    public static Client toEntity(ClientDTO clientDTO){
        Client client =new Client();
        client.setId(clientDTO.getId());
        client.setDisplayName(clientDTO.getUserName());
        client.setMail(clientDTO.getMail());
        client.setCity(clientDTO.getCity());
        client.setTotalPoints(clientDTO.getTotalPoints());
        client.setPassword(clientDTO.getPassword());
        return client;
    }
    public static ClientDTO toDTO(Client client) {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setId(client.getId());
        clientDTO.setUserName(client.getDisplayName());
        clientDTO.setMail(client.getMail());
        clientDTO.setCity(client.getCity());
        clientDTO.setTotalPoints(client.getTotalPoints());
        for(Classement classement: client.getClassements()){
            clientDTO.getClassement().add(ClassementMapper.toDTO(classement));
        }
        return clientDTO;
    }
}
