import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginInput, SignUpInput } from './dto/inputs';
import { AuthResponse } from './dto/types/auth-response.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  //TODO implement as REST API
  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignUpInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }
  //TODO implement as REST API
  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentUser([]) user: User): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
