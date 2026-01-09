import { Entity } from '@/shared/kernel/entity';
import { ProfileEmail } from '../value-objects/profile-email';
import { ProfileName } from '../value-objects/profile-name';
import { ProfileId } from '../value-objects/profile-id';
import { Optional } from '@/shared/kernel/optional';

export interface ProfileProps {
  name: ProfileName;
  email: ProfileEmail;
  createdAt: Date;
  updatedAt: Date;
}

type CreateProfileProps = Optional<ProfileProps, 'createdAt' | 'updatedAt'>;

export class Profile extends Entity<ProfileProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: ProfileProps, id?: ProfileId) {
    super(props, id);
  }

  static create(props: CreateProfileProps, id?: ProfileId): Profile {
    const now = new Date();
    return new Profile(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    );
  }
  changeEmail(newEmail: ProfileEmail) {
    this.props.email = newEmail;
    this.props.updatedAt = new Date();
  }

  changeName(newName: ProfileName) {
    this.props.name = newName;
    this.props.updatedAt = new Date();
  }
}
