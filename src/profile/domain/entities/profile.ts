import { ProfileEmail } from '../value-objects/profile-email';
import { ProfileName } from '../value-objects/profile-name';
import { ProfileId } from '../value-objects/profile-id';
import { Optional } from '@/shared/kernel/optional';
import { AggregateRoot } from '@/shared/kernel/aggregate-root';
import { ProfileCreatedEvent } from '../events/profile-created-event';

export interface ProfileProps {
  name: ProfileName;
  email: ProfileEmail;
  createdAt: Date;
  updatedAt: Date;
}

type CreateProfileProps = Optional<ProfileProps, 'createdAt' | 'updatedAt'>;

export class Profile extends AggregateRoot<ProfileProps> {
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
    const profile = new Profile(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    );

    profile.addDomainEvent(new ProfileCreatedEvent(profile.id, profile.email));

    return profile;
  }

  static rehydrate(props: ProfileProps, id: ProfileId): Profile {
    return new Profile(props, id);
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
