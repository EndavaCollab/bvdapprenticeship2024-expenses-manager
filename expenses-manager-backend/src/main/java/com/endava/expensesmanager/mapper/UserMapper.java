package com.endava.expensesmanager.mapper;

import com.endava.expensesmanager.dto.UserDto;
import com.endava.expensesmanager.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto usersToUserDto(Users users);

    Users userDtoToUsers(UserDto userDto);
}
