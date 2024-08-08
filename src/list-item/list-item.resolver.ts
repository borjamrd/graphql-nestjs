import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { ListItem } from './entities/list-item.entity';
import { ListItemService } from './list-item.service';


@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) { }

  @Mutation(() => ListItem)
  async createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    @CurrentUser() user: User
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput, user);
  }

  @Query(() => ListItem, { name: 'listItem' })
  findOne(@Args('id', { type: () => String }, ParseUUIDPipe) id: ListItem['id']) {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem)
  async updateListItem(@Args('updateListItemInput') updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    return this.listItemService.update(updateListItemInput.id, updateListItemInput);
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
