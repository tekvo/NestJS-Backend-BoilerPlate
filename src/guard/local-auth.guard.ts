import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Provider } from 'src/constant/enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(Provider.Local) {}
